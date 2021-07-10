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
})

mooyaho.addEventListener('entered', e => {
  console.group('User Entered')
  console.log(e)
  console.groupEnd()
})

mooyaho.addEventListener('left', e => {
  console.group('User Left')
  console.log(e.sessionId)
  console.groupEnd()
})

mooyaho.connect()
