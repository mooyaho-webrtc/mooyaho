import "./style.css";

const ws = new WebSocket("ws://localhost:8081/websocket");

const rtcConfiguration = {};

ws.addEventListener("message", (event) => {
  handleMessage(event.data.toString());
});

ws.addEventListener("open", () => {
  integrateUser("tester");
});

function sendJSON(object) {
  const message = JSON.stringify(object);
  console.log(message);
  ws.send(message);
}

let sessionId = null;
const localPeers = {};

function handleMessage(message) {
  try {
    const action = JSON.parse(message);
    if (!action.type) {
      throw new Error("There is no type in action");
    }

    switch (action.type) {
      case "connected":
        console.log(`sessionId: ${action.id}`);
        sessionId = action.id;
        break;
      case "entered":
        if (action.sessionId === sessionId) {
          listSessions();
          break;
        }
        call(action.sessionId);
        break;
      case "called":
        answer(action.from, action.sdp);
        break;
      case "answered":
        answered(action.from, action.sdp);
        break;
      case "candidated":
        candidated(action.from, action.candidate);
        break;
    }
  } catch (e) {
    console.log(e);
  }
}

const channelForm = document.querySelector("#channelForm");

async function createMediaStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    return stream;
  } catch (e) {
    console.error(e);
  }
}

function enterChannel(channelName) {
  sendJSON({
    type: "enter",
    channel: channelName,
  });
}

function listSessions() {
  sendJSON({
    type: "listSessions",
  });
}

async function call(to) {
  const stream = localStream;

  const localPeer = new RTCPeerConnection(rtcConfiguration);
  localPeer.addEventListener("connectionstatechange", (e) => {
    console.log({ connectionState: e.target.connectionState });
  });
  localPeers[to] = localPeer;

  localPeer.addEventListener("icecandidate", (e) => {
    icecandidate(to, e.candidate);
  });

  const video = document.createElement("video");
  document.body.appendChild(video);
  video.autoplay = true;

  localPeer.addEventListener("track", (ev) => {
    console.log({ streams: ev.streams });
    if (video.srcObject !== ev.streams[0]) {
      video.srcObject = ev.streams[0];
    }
  });

  stream.getTracks().forEach((track) => {
    console.log(track);
    localPeer.addTrack(track, stream);
  });

  const offer = await localPeer.createOffer();
  console.log("offer: ", offer);
  await localPeer.setLocalDescription(offer);

  sendJSON({
    type: "call",
    to,
    sdp: offer.sdp,
  });
}

async function answer(to, sdp) {
  const stream = localStream;
  const localPeer = new RTCPeerConnection(rtcConfiguration);
  localPeers[to] = localPeer;

  localPeer.addEventListener("icecandidate", (e) => {
    icecandidate(to, e.candidate);
  });

  const video = document.createElement("video");
  document.body.appendChild(video);
  video.autoplay = true;

  localPeer.addEventListener("track", (ev) => {
    if (video.srcObject !== ev.streams[0]) {
      video.srcObject = ev.streams[0];
    }
  });

  stream.getTracks().forEach((track) => {
    localPeer.addTrack(track, stream);
  });

  await localPeer.setRemoteDescription({
    type: "offer",
    sdp,
  });
  const answer = await localPeer.createAnswer();
  await localPeer.setLocalDescription(answer);

  sendJSON({
    type: "answer",
    to,
    sdp: answer.sdp,
  });
}

async function answered(from, sdp) {
  const localPeer = localPeers[from];
  if (!localPeer) {
    console.error(`localPeer ${from} does not exist`);
    return;
  }
  await localPeer.setRemoteDescription({
    type: "answer",
    sdp,
  });
  console.log(`setRemoteDescription success for ${from}`);
}

function icecandidate(to, candidate) {
  sendJSON({
    type: "candidate",
    to,
    candidate,
  });
}

function candidated(from, candidate) {
  const localPeer = localPeers[from];
  if (!localPeer) {
    console.error(`localPeer ${from} does not exist`);
    return;
  }

  try {
    localPeer.addIceCandidate(candidate);
    console.log(`Candidate from ${from} success!`);
  } catch (e) {
    console.error(`Failed to candidate: ${e.toString()}`);
  }
}

channelForm.addEventListener("submit", async (e) => {
  channelForm.querySelector("button").disabled = true;
  e.preventDefault();

  enterChannel(channelForm.channelName.value);
});

let localStream = null;
createMediaStream().then((stream) => {
  localStream = stream;
  const myVideo = document.createElement("video");
  document.body.appendChild(myVideo);
  myVideo.autoplay = true;

  myVideo.srcObject = stream;
  myVideo.volume = 0;
});

function integrateUser(displayName) {
  sendJSON({
    type: "integrateUser",
    user: {
      displayName,
    },
  });
}

window.integrateUser = integrateUser;

// const button = document.body.querySelector('#btnLoadCam');

// async function loadCamera() {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: false,
//       video: true
//     });
//     const videoTracks = stream.getVideoTracks()
//     myVideo.srcObject = stream
//   } catch (e) {
//     console.error(e);
//   }
// }

// button.addEventListener('click', () => {
//   loadCamera()
// })
