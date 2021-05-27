import './style.css'

const ws = new WebSocket('ws://localhost:8080/websocket')
const myVideo = document.body.querySelector('#myVideo')

const rtcConfiguration = {}


ws.addEventListener('message', (event) => {
  handleMessage(event.data.toString())
})

function sendJSON(object) {
  const message = JSON.stringify(object);
  ws.send(message)
}


let sessionId = null
let localPeer = null

function handleMessage(message) {
  try {
    const action = JSON.parse(message);
    if (!action.type) {
      throw new Error('There is no type in action');
    }

    switch (action.type) {
      case 'connected': 
        console.log(`sessionId: ${action.id}`)
        sessionId = action.id
        break;
      case 'entered': 
        if (action.sessionId === sessionId) {
          break;
        }
        call(action.sessionId)
        break;
      case 'called': 
        answer(action.from, action.description)
        break;
      case 'answered':
        answered(action.from, action.description)
        break;
      case 'candidated':
        candidated(action.from, action.candidate)
        break;
    }
  } catch (e) {
    console.log(e)
  }
}

const channelForm = document.querySelector('#channelForm')


let localStream = null

async function initializeStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    console.log('Received localStream')
  } catch (e) {
    console.error(e);
  } 
}


function enterChannel(channelName) {
  sendJSON({
    type: 'enter',
    channel: channelName
  })
}


async function call(to) {
  if (!localStream) return;

  localPeer = new RTCPeerConnection(rtcConfiguration)
  localPeer.addEventListener('icecandidate', e => {
    icecandidate(to, e.candidate)
  })
  localPeer.addEventListener('track', (ev) => {
    if (myVideo.srcObject !== ev.streams[0]) {
      myVideo.srcObject = ev.streams[0]
    }
  })


  localStream.getTracks().forEach(track => {
    localPeer.addTrack(track, localStream)
  })

  const offer = await localPeer.createOffer()
  console.log('offer: ', offer)
  await localPeer.setLocalDescription(offer)
  

  sendJSON({
    type: 'call',
    to,
    description: offer
  })
}

async function answer(to, description) {
  if (!localStream) return;

  localPeer = new RTCPeerConnection(rtcConfiguration)
  localPeer.addEventListener('icecandidate', e => {
    icecandidate(to, e.candidate)
  })
  localPeer.addEventListener('track', (ev) => {
    if (myVideo.srcObject !== ev.streams[0]) {
      myVideo.srcObject = ev.streams[0]
    }
  })

  localStream.getTracks().forEach(track => {
    localPeer.addTrack(track, localStream)
  })

  await localPeer.setRemoteDescription(description)
  const answer = await localPeer.createAnswer()
  await localPeer.setLocalDescription(answer)
  

  sendJSON({
    type: 'answer',
    to,
    description: answer
  })
}


async function answered(from, description) {
  await localPeer.setRemoteDescription(description)
  console.log(`setRemoteDescription success for ${from}`)
}

function icecandidate(to, candidate) {
  sendJSON({
    type: 'candidate',
    to,
    candidate
  })
}

function candidated(from, candidate) {
  try {
    localPeer.addIceCandidate(candidate)
    console.log(`Candidate from ${from} success!`)
  } catch (e) {
    console.error(`Failed to candidate: ${e.toString()}`)
  }
}




channelForm.addEventListener('submit', async e => {
  channelForm.querySelector('button').disabled = true
  e.preventDefault()
  
  await initializeStream()
  enterChannel(channelForm.channelName.value)
})

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