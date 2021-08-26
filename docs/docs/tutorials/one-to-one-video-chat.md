---
sidebar_position: 2
---

# 1:1 Video Chat

## Introduction

We will implement 1:1 video chat with Mooyaho in this tutorial. In this part, we will skip the server implementation. We will implement the feature by directly entering the Session ID.

When user enters the webpage, a Session ID will be issued to the user. User can share this Session ID to whom he/she wants to chat.

Before starting this tutorial, you should prepare a running Mooyaho Engine server. If your Mooyaho Engine server is not ready, please check [Setup server](http://localhost:3000/docs/getting-started#setup-server).

## Create a web project with Snowpack

In this section, we will create a web project using [Snowpack](https://www.snowpack.dev/). Snowpack is a frontend build tool designed for the modern web. You can use other tools if you want (such as Parcel, Webpack, etc). We chose Snowpack because it is simple and fast.

```bash
# create a directory
mkdir one-to-one-sample
cd one-to-one-sample
yarn init -y # or npm init -y
yarn add --dev snowpack # or npm install --save-dev snowpack
```

Then, add following scripts to your `package.json` file.

```json
"scripts": {
    "start": "snowpack dev",
    "build": "snowpack build"
}
```

Default port of snowpack dev server is 8080, which collides with Mooyaho Engine server. You should change the port of one of those servers. We will change the port of snowpack dev server to 8081.

To do this, you have to initialize snowpack config by following command.

```
yarn snowpack init # or npx snowpack init
```

This command will create `snowpack.config.js` file in your project directory. Open this file and add set `devOptions.port` to `8081`.

You can now run your dev server with `yarn start` or `npm start`.

## Initialize html, js, css files

First, create a index.js file in project root directory.

`index.js`

```javascript
console.log('Hello World')
```

Then, create a empty `style.css` file in project root directory.

Finally, create `index.html` and copy the code below.

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <script src="/index.js" type="module"></script>
  </body>
</html>
```

> Don't forget to set `type="module"` attribute to `index.js` file. You need this attribute to use `import` statement in your js file.

## Install Mooyaho Client SDK

Install Mooyaho Client SDK to integrate Mooyaho Engine in your web app.

```bash
yarn add @mooyaho/browser # or npm install @mooyaho/browser
```

Now, you are ready to use Mooyaho Engine.

## Initialize UI for 1:1 Video Chat

Let's first implment UI for 1:1 video chat. In upper section, we will create a user interface where user can get their own Session ID or enter other user's Session ID.

Modify the body tag of `index.html` as below.

```html
<body>
  <div>
    My Session ID:
    <span id="my-session-id"></span>
  </div>
  <form id="call-form">
    Enter Session ID to call:
    <input name="session_id" placeholder="Session ID" />
    <button type="submit">Call</button>
  </form>
  <div id="status">Ready</div>
  <button id="hangup" disabled>Hang up</button>
  <script src="/index.js" type="module"></script>
</body>
```

![](/img/tutorial/initial-ui.png)

Then, we will show two video tags on your screen. One for your own video and another for other user's video. Add the following code below the hang up button tag.

`index.html`

```html
<div class="videos">
  <video id="local-video" autoplay></video>
  <video id="remote-video" autoplay></video>
</div>
```

And here is the style code for these video tags. Edit `style.css` as below.

`style.css`

```css
.videos {
  display: flex;
  align-items: flex-end;
}

.videos video {
  background: black;
}

#local-video {
  width: 128px;
  height: 128px;
}

#remote-video {
  margin-left: 16px;
  width: 320px;
  height: 320px;
}
```

![](/img/tutorial/initial-ui-2.png)

## Initialize Mooyaho Instance and get Session ID issued.

Now, we will import Mooyaho Client SDK and initialize an instance.

`index.js`

```js
import Mooyaho from 'mooyaho-client-sdk'

const mooyaho = new Mooyaho({
  url: 'ws://localhost:8080',
  allowDirectCall: true,
})
```

Then, we will connect to the server using `connect` method. This method returns a Promise that resolves Session ID. After getting Session ID, we will set the value at `#my-session-id` span element.

Write the below in `index.js`

```js
mooyaho.connect().then((sessionId) => {
  const mySessionIdDiv = document.getElementById('my-session-id')
  mySessionIdDiv.innerHTML = sessionId
})
```

Now check your page on your browser, then you will see the current Session ID on the top of the page.

## Get user media and show it on screen.

This time, we will get user's audio and video stream from browser and show it on our video tag that we've created. When we show the user's own video stream we have to set it muted or else audio howling feedback will occur.

Write the code below in `index.js`.

```js
mooyaho
  .createUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    // add video tag to body and set stream
    const localVideo = document.getElementById('local-video')
    localVideo.muted = true
    localVideo.srcObject = stream
  })
```

Now, the browser will request permission for user's stream, and video will be shown on the `#local-video` element.

![](/img/tutorial/local-video.png)

## Call other user by entering Session ID

Let's call other user by entering their Session ID on the form. We will register event handler for `submit` event on the `#call-form` element.

In this handler, we will call `directCall` method of the Mooyaho Client SDK instance.

`index.html`

```js
const callForm = document.getElementById('call-form')

callForm.addEventListener('submit', (e) => {
  e.preventDefault() // prevents refreshing page
  const sessionId = callForm.querySelector('input').value
  mooyaho.directCall(sessionId)
})
```

And this is it! Mooyaho will do all the work for the connection establishment. You can get notified when peer connection is successfully established by registering a event handler with mooyaho.

```js
mooyaho.addEventListener('peerConnected', (event) => {
  console.log('Peer is now connected', event)
})
```

Now, you just need to show the peer's stream on your screen.

## Show remote peer's stream

To show remote peer's stream, you have to handle `remoteStreamChanged` of `mooyaho` instance. Write the code below in `index.js` to do so.

```javascript
mooyaho.addEventListener('remoteStreamChanged', (event) => {
  const remoteVideo = document.getElementById('remote-video')
  remoteVideo.srcObject = mooyaho.getRemoteStreamById(event.sessionId)
})
```

Now, open a new window in your browser and enter the Session ID of the other page to check the code is working.

> Before you test this, it is recommended to mute the system volume because this will make audio howling feedback.

![](/img/tutorial/one-to-one-success.png)

In `peerConnected` or `remoteStreamChanged` handler, you can acces the `RTCPeerConnection` instance of the peer. So, you can do anything you want with it.

Mooyaho's `directCall` feature is not restricted to to single connection. You can call multiple users by passing Session ID to `directCall` method.

To get the full code of this project, check this [GitHub Repo](https://github.com/)

## Conclusion

You have successfully implemented one to one video chat with Mooyaho! If you want to implement
video call feature with multiple users, check out the next tutorial.
