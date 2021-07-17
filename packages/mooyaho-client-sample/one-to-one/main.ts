import Mooyaho, { MooyahoConfig } from 'mooyaho-client-sdk/src/index'

const config: MooyahoConfig = {
  url: 'ws://localhost:8081',
  allowDirectCall: true,
}

const mooyaho = new Mooyaho(config)

mooyaho
  .createUserMedia({
    audio: true,
    video: true,
  })
  .then(stream => {
    // add video tag to body and set stream
    const video = document.createElement('video')
    video.width = 200
    video.height = 200
    video.muted = true
    video.autoplay = true
    video.srcObject = stream
    document.getElementById('me').appendChild(video)
  })

mooyaho.connect().then(sessionId => {
  const sessionIdSpan = document.getElementById('session-id')
  sessionIdSpan.innerHTML = sessionId
})

document.getElementById('call').addEventListener('click', () => {
  const sessionIdInput = document.getElementById(
    'session-id-input'
  ) as HTMLInputElement
  const sessionId = sessionIdInput.value

  mooyaho.directCall(sessionId)
})

mooyaho.addEventListener('remoteStreamChanged', e => {
  const otherDiv = document.getElementById('other')
  let video = otherDiv.querySelector('video')
  if (!video) {
    video = document.createElement('video')
    video.autoplay = true
    video.width = 200
    video.height = 200
    otherDiv.appendChild(video)
  }
  video.srcObject = mooyaho.getRemoteStreamById(e.sessionId)
})
