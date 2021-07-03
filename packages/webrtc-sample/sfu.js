import "./style.css";

const ws = new WebSocket("ws://localhost:8081/websocket");

const rtcConfiguration = {};

ws.addEventListener("open", () => {
  integrateUser("tester");
});

ws.addEventListener("message", (event) => {
  handleMessage(event.data.toString());
});

function sendJSON(object) {
  const message = JSON.stringify(object);
  console.group("Send");
  console.log(object.type);
  console.log(object);
  console.groupEnd("Send");
  ws.send(message);
}

let sessionId = null;
const localPeers = {};

const config = {
  sfuEnabled: false,
};

function handleMessage(message) {
  try {
    const action = JSON.parse(message);
    console.group("Receive");
    console.log(action.type);
    console.log(action);
    console.groupEnd("Receive");
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
          break;
        }
        if (config.sfuEnabled) return;
        call(action.sessionId);
        break;
      case "called":
        answer(action.from, action.sdp, action.isSFU);
        break;
      case "answered":
        answered(action.from, action.sdp, action.isSFU);
        break;
      case "candidated":
        candidated(action.from, action.candidate, action.isSFU);
        break;
      case "enterSuccess":
        enterSuccess(action.sfuEnabled);
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
      video: { width: 426, height: 240 },
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
  const stream = await createMediaStream();

  const localPeer = new RTCPeerConnection(rtcConfiguration);

  localPeers[to] = localPeer;
  localPeer.addEventListener("connectionstatechange", (e) => {});
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

  const offer = await localPeer.createOffer();
  await localPeer.setLocalDescription(offer);

  sendJSON({
    type: "call",
    to,
    description: offer,
  });
}

async function answer(to, sdp, isSFU) {
  if (isSFU) {
    const localPeer = new RTCPeerConnection(rtcConfiguration);

    localPeers[to] = localPeer;

    localPeer.addEventListener("icecandidate", (e) => {
      sfuCandidate(e.candidate, to);
    });
    localPeer.addEventListener("connectionstatechange", (e) => {
      if (sfuPeer.connectionState === "connected") {
      }
    });

    const video = document.createElement("video");
    document.body.appendChild(video);
    video.autoplay = true;

    localPeer.addEventListener("track", (ev) => {
      console.log("track", ev.streams);
      if (video.srcObject !== ev.streams[0]) {
        video.srcObject = ev.streams[0];
      }
    });

    await localPeer.setRemoteDescription({ type: "offer", sdp });

    const answer = await localPeer.createAnswer();
    await localPeer.setLocalDescription(answer);

    sendJSON({
      type: "answer",
      to,
      sdp: answer.sdp,
      isSFU: true,
    });
    return;
  }

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

async function answered(from, sdp, isSFU) {
  if (isSFU) {
    if (!sfuPeerConnection) {
      console.error("sfuPeer does not exist");
      return;
    }

    console.log({
      type: "answer",
      sdp,
    });
    await sfuPeerConnection.setRemoteDescription(
      new RTCSessionDescription({
        type: "answer",
        sdp,
      })
    );
    return;
  }

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

function candidated(from, candidate, isSFU) {
  if (isSFU) {
    if (!from) {
      sfuPeerConnection.addIceCandidate(candidate);
    } else {
      const localPeer = localPeers[from];
      if (!localPeer) {
        console.error("localPeer not found");
        return;
      }
      localPeer.addIceCandidate(candidate);
    }
    return;
  }
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

let sfuPeerConnection = null;

function enterSuccess(sfuEnabled) {
  config.sfuEnabled = sfuEnabled;
  listSessions();
  if (!sfuEnabled) return;
  sfuCall();
}

async function sfuCall() {
  const sfuPeer = new RTCPeerConnection(rtcConfiguration);
  sfuPeerConnection = sfuPeer;
  sfuPeer.addEventListener("icecandidate", (e) => {
    sfuCandidate(e.candidate);
  });
  sfuPeer.addEventListener("connectionstatechange", (e) => {
    console.log(sfuPeer.connectionState);
  });
  window.sfuPeer = sfuPeer;

  localStream.getTracks().forEach((track) => {
    sfuPeer.addTrack(track, localStream);
  });

  const offer = await sfuPeer.createOffer();
  sfuPeer.setLocalDescription(offer);

  sendJSON({
    type: "call",
    sdp: offer.sdp,
    isSFU: true,
  });
}

function sfuCandidate(candidate, sessionId) {
  sendJSON({
    type: "candidate",
    candidate,
    to: sessionId,
    isSFU: true,
  });
}

window.enterSuccess = enterSuccess;

window.integrateUser = integrateUser;

function disconnect() {
  sfuPeerConnection.close();
  // localPeers.forEach((peer) => {
  //   peer.close();
  // });
}

window.disconnect = disconnect;

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
