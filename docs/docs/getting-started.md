---
sidebar_position: 1
---

# Getting Started

**Mooyaho** is a framework that allows you to build a WebRTC realtime app easily. Implementing WebRTC is complex; you have to prepare all websocket logics, authentication, channel management and so on. This framework will do all of that for you. **Mooyaho** is an open source project and it is completely free. This framework can help you to concentrate on business logic when you are building a realtime app.

## About

**Mooyaho** is consisted with four major projects:

1. **Client SDK**: This is used from browsers. Other clients like Android, iOS, React Native, Unity, will be supported in the future.
2. **Server**: This is a server that manages user connection and channels.
3. **Sever SDK**: This is used from your service server to manage user authentication. This is currently only supported in Node.js. If you are not using Node.js, you can implement it by calling REST API (docs).
4. **SFU Server**: This is Selective Forwarding Unit Server. Using this server is optional. It is used to optimize the performance when there are many users in a single channel.

## Installation

### Setup Server

This framework is built with JavaScript only. You just need Node.js (>v14) to run the server. Additionally, you need Redis to run the server. Mooyaho server connects to redis server at localhost by default. You can change the Redis server address from `.env` file of root directory of the mooyaho server server. To check detailed information about the environment variables, read [Server Settings](./server-settings.md).

Following command will create Mooyaho Server in my-server directory.

```bash
npx create-mooyaho-server my-server
```

Default port of the server is 8080. If you want to change the server config, open `.env` file

Then run following command to run the server

```bash
yarn start # or npm start
```

or

```bash
npm start
```

### Install Mooyaho Client SDK in your Web Application

You can install the Mooyaho Client SDK with this command:

```
yarn add @mooyaho/browser
```

or

```
npm install @mooyaho/browser
```

> If you are not using any bundler for your Web Application, you can load Mooyaho from CDN
>
> ```html
> <script src="https://cdnjs.blabla.com/mooyaho.dist.js"></script>
> ```

### Install Mooyaho Server SDK in Your Service Server

If you need authentication feature in your app, you have to install Mooyaho Server SDK to your service server. This SDK allows you to integrate user information with the users who are connected to the Mooyaho Server. If you do not need any authentication feature, you can set `allowAnonymous` option to `true` from `mooyaho.config.json`. By setting this option, users can setup their user information directly from client. For detailed information check this link: [Allow Anonymous](./architecture.md)

## Overview

In this section, you will learn the basic usage of **Mooyaho**. After reading this section please read the Tutorials page where you can actually put your hands on Mooyaho and build your own app step by step.

### Initialize Client SDK Instance

Suppose your Mooyaho Server address is `localhost:8080`, you can initialize Mooyaho instance and connect to the server by following code:

```javascript
import Mooyaho from '@mooyaho/browser'

const mooyaho = new Mooyaho({
  ws: 'ws://localhost:8080',
})
```

### Integrate User

When user has connected to Mooyoho server, server will issue user a Session ID. You can check this Session ID by register a callback function to `connected` event

```javascript
mooyaho.addEventListener('connected', (e) => {
  console.log(`Session ID: ${e.sessionId}`)
  sendSessionIdToServer(e.sessionId) // implement it by yourself.
})
```

At this point, you have to integrate user information with your Session ID. In order to do that, you have to pass the Session ID to your service server (by REST API or Websocket implemented by yourself). When server receives the Session ID of the user, user information can be integrated by using this code.

```javascript
import MooyahoServerSDK from '@mooyaho/server-sdk'

// Initialize Server SDK Instance
// API_KEY is set in .env file.
const serverSDK = new MooyahoServerSDK('http://localhost:8080', 'YOUR_API_KEY')

// when server receives sessionId:
app.post('/integrate', async (req, res) => {
  const { sessionId } = req.body
  const user = req.user
  await serverSDK.integrateUser(sessionId, {
    id: user.id.toString(), // only id field is necessary
    username: user.username, // extra field example
    /*
      ...
      You can put any extra fields
    */,
  })
  res.send(true)
})
```

### Create Channel

Creating channel is mandatory when you want to implement video/audio chat for multiple users. If you want to implement 1:1 video/audio chat, this process can be skipped.

To create channel, following API should be called via Server SDK.

```typescript
serverSDK.createChannel(isSFU?: boolean): Promise<Channel>
```

If you want to enable SFU Server for your channel, you should set `isSFU` paramaeter to `true`. This parameter is optional, if you do not need SFU Server, you can just omit the parameter.

#### Example

```javascript
const channel = await serverSDK.createChannel()
```

`Channel` object contains `id` and `sfuServerId`. Normally, you do not need to deal with `sfuServerId`. After creating a channel, you have to pass the `channel.id` to user in order for user to enter the channel.

You can implement this by using REST API or WebSocket.

### Prepare User Media

Before entering channel, user has to prepare user media by following API of client SDK.

```typescript
mooyaho.createUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>
```

After calling this method, it will resolve MediaStream so that you can show the video from your video DOM.

`contstraints` is the same type of the [`navigator.getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

#### Example

```javascript
mooyaho
  .createUserMedia({
    audio: true,
    video: {
      width: { max: 720 },
      height: { max: 480 },
    },
  })
  .then((stream) => {
    // add video tag to body and set stream
    const video = document.createElement('video')
    video.muted = true
    video.autoplay = true
    video.srcObject = stream
    document.getElementById('me').appendChild(video)
  })
```

> Currently, [getDisplayMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) for screen sharing is not supported yet. This will be implemented in future release.

### Enter Channel

After getting the user media prepared, the user can enter to the channel by calling `enter` API of the Client SDK.

```typescript
mooyaho.enter(id: string): void
```

The `id` parameter is the `channel.id` that has been created in the [Create Channel](/docs/getting-started#create-channel) section.

If you want to execute some tasks after user successfully enters the channel, you can register the handler function by using `addEventListener` API.

#### Example

```javascript
mooyaho.addEventListener('enterSuccess', (e) => {
  console.log(`Successfully entered to channel ${mooyaho.channelId}`)
  console.log(`SFU is ${e.sfuEnabled ? 'enabled' : 'disabled'} in this channel`)
  // Do Something

  // Usually, you can implement the UI that represents other users that are in this channel.
  // sessonsArray contains the session information of all users in the channel including yourself.
  const sessionArray = mooyaho.sessionsArray

  sessionArray.forEach((session) => {
    if (session.id === mooyaho.sessionId) return // ignore session for yourself
    const sessionDiv = createSessionDiv(session.id, session.user.username)
    othersDiv.appendChild(sessionDiv)
  })
})
```

### Dealing with other user's enter and leave

If you want to do something when other user enters or leaves the channel you are currently in, register event listener for `entered` or `leaved` event.

#### Example

```javascript
mooyaho.addEventListener('entered', (e) => {
  if (e.isSelf) return // e.isSelf is true when it is a entered event of current user
  // You can add the UI of the user who has entered the channel after you
  // e.user is the information you have integrated from the server
  const sessionDiv = createSessionDiv(e.sessionId, e.user.username)
  othersDiv.appendChild(sessionDiv)
})

mooyaho.addEventListener('left', (e) => {
  // You can remove the UI of the user who has left the channel
  const video = document.getElementById(e.sessionId)
  if (video) {
    video.parentNode.removeChild(video)
  }
})
```

### Dealing with other user's stream

To use the video or audio that other user has sent, you have handle `remoteStreamChanged` event. In this event, you will receive the sessionId of the user. You can select the stream of the speicific user by using `getRemoteStreamById(id: string)`.

#### Example

```javascript
mooyaho.addEventListener('remoteStreamChanged', (e) => {
  const sessionDiv = document.getElementById(e.sessionId)
  if (!sessionDiv) return

  const stream = mooyaho.getRemoteStreamById(e.sessionId)

  const video = sessionDiv.querySelector('video')
  video.srcObject = stream
})
```

### Leaving Channel

To leave the channel, call `leave` API.

```javascript
mooyaho.leave()
```
