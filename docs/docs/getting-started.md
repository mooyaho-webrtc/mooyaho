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

This framework is built with JavaScript only. You just need Node.js (>v14) to run the server.

Following command will create Mooyaho Server in my-server directory.

```bash
npx create-mooyaho-server my-server
```

Default port of the server is 8080. If you want to change the server config, open `.env` file of root directory of your server. To check detailed information about the environment variables, read [Server Settings](./server-settings.md).

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

## Build Your First Mooyaho App

If you have installed Client / Server SDK, and have started your Mooyaho Server, then you are ready to build your first Mooyaho App. Suppose your Mooyaho Server address is `localhost:8080`, you can initialize Mooyaho instance and connect to the server by following code:

```javascript
import Mooyaho from '@mooyaho/browser'

const mooyaho = new Mooyaho({
  ws: 'ws://localhost:8081',
})
```

When user has connected to Mooyoho server, server will issue user a Session ID. You can check this Session ID by registering `connected` event

```javascript
mooyaho.addEventListener('connected', (e) => {
  console.log(`Session ID: ${e.sessionId}`)
})
```

At this point, you have to integrate user information with your Session ID. In order to do that, you have to pass the Session ID to your service server (by REST API or Websocket implemented by yourself). When server receives the Session ID of the user, user information can be integrated by using this code.
