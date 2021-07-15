import './styles.css'
import Mooyaho, { MooyahoConfig } from 'mooyaho-client-sdk/src/index'
import MooyahoServerSDK from 'mooyaho-server-sdk'

// CAUTION: Server SDK should be only used from server
const serverSDK = new MooyahoServerSDK(
  'http://localhost:8081',
  'ec24c791f058b01abccc8e3c5e8cd50b'
)

// select elements
const createButton = document.getElementById('create-button')
const createdChannelIdSpan = document.getElementById('created-channel-id')
const enterButton = document.getElementById('enter-button')
const channelIdInput = document.getElementById(
  'channel-id-input'
) as HTMLInputElement
const usernameInput = document.getElementById('username') as HTMLInputElement
const leaveButton = document.getElementById('leave')
const othersDiv = document.getElementById('others')

// setup ui
createButton.addEventListener('click', async () => {
  const channel = await serverSDK.createChannel()
  createdChannelIdSpan.innerHTML = `<b>ID:</b> ${channel.id}`
  mooyaho.enter(channel.id)
})

enterButton.addEventListener('click', () => {
  mooyaho.enter(channelIdInput.value)
})

leaveButton.addEventListener('click', () => {
  mooyaho.leave()
})

const config: MooyahoConfig = {
  url: 'ws://localhost:8081',
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

mooyaho.addEventListener('connected', e => {
  console.log('Successfully connected to Mooyaho Server')
  console.log(`Session ID: ${e.sessionId}`)
  // NOTE: To intergate user from browser, `allowAnonymous` field
  // should be true from mooyaho.config.json of mooyaho-server.
  // In normal cases, user should be integrated by using server SDK
  mooyaho.integrateUser({
    username: usernameInput.value,
  })
})

mooyaho.addEventListener('enterSuccess', e => {
  console.log(`Successfully entered to channel ${mooyaho.channelId}`)
  console.log(`SFU is ${e.sfuEnabled ? 'enabled' : 'disabled'} in this channel`)
  leaveButton.style.display = 'block'

  const sessionArray = mooyaho.sessionsArray

  sessionArray.forEach(session => {
    if (session.id === mooyaho.sessionId) return
    const sessionDiv = createSessionDiv(session.id, session.user.username)
    othersDiv.appendChild(sessionDiv)
  })
})

function createSessionDiv(sessionId: string, username: string) {
  const sessionDiv = document.createElement('div')
  sessionDiv.id = sessionId
  sessionDiv.innerHTML = `
    <video width="200" height="200" autoplay></video>
    <div class="session-id">${sessionId}</div>
    <div class="username">${username}</div>
  `
  return sessionDiv
}

mooyaho.addEventListener('entered', e => {
  console.group('User Entered')
  console.log(e)
  console.groupEnd()

  if (e.isSelf) return
  const sessionDiv = createSessionDiv(e.sessionId, e.user.username)
  othersDiv.appendChild(sessionDiv)
})

mooyaho.addEventListener('left', e => {
  console.group('User Left')
  console.log(e.sessionId)
  console.groupEnd()

  // find video tag by sessionId and remove it
  const video = document.getElementById(e.sessionId)
  if (video) {
    video.parentNode.removeChild(video)
  }
})

mooyaho.addEventListener('remoteStreamChanged', e => {
  // select div by e.sessionId
  const sessionDiv = document.getElementById(e.sessionId)
  if (!sessionDiv) return

  const stream = mooyaho.getRemoteStreamById(e.sessionId)

  const video = sessionDiv.querySelector('video')
  video.srcObject = stream
})

mooyaho.connect()

// for debug purpose
;(window as any).mooyaho = mooyaho
