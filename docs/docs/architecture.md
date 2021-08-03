---
sidebar_position: 2
---

# Architecture

This document will describe the workflow of Mooyaho. Reading this document is not required to use Mooyaho, it just helps you with understanding how the whole system works.

If you are using Mooyaho, you have to prepare following servers:

1. **Mooyaho Server**: This server will manage the sessions and the channels. This server provides REST API and WebSocket API. This server can be scaled up to multiple instances if you use a load balancer (Using AWS ElasticLoadbalancer or Nginx is recommended).
2. **Redis Server**: Mooyaho server uses a Redis server for channel subscription.
3. **SFU Server**: Using this server is optional. This server is used when you want to apply [SFU](https://webrtcglossary.com/sfu/) to the channel. You can have multiple SFU Servers. You can manage the SFU server using the [REST API](/).
4. **Service Server**: This is the server that you implement for your service. You can create a channel or integrate user authentication with Mooyaho sessions. If you do not have a server for your service, you can still use Mooyaho with `allowAnonymous` mode (this is INSECURE).

## Scenario 1: Many to Many video chat

This section illustrates how many to many video chat works with Mooyaho.

### 1. User creates a channel

![User creates a channel](/img/architecture/create-channel.png)

1. User (Client A) creates a channel by calling a REST API of your own service server that you need to implement.
2. Service Server creates a channel by using `createChannel` API of Mooyaho Server SDK.
3. Mooyaho Server creates a channel and generates a unique Channel ID and responds to the Service Server.
4. Service Server now responds to the user and passes the Channel ID.

### 2. User enters the Channel

![User enters the channel](/img/architecture/first-user-enters-channel.png)

1. User (Client A) connects to the Mooyaho Server.
2. Mooyaho Server generates a unique Session ID, and passes to the user.
3. User integrates thes Session ID with the current User information by calling a REST API of your own service server that you need to implement.
4. Service Server integrates User information with the Session by using `integrateUser` API of Mooyaho Server SDK.
5. Finally, the user enters the channel by using `enter` API of Client SDK.

### 3. Second user enters the Channel

![User creates & enters the channel](/img/architecture/enter-existing-channel.png)

Suppose a user (Client A) has already entered to a Mooyaho channel.

1. User (Client B) connects to the Mooyaho Server.
2. Mooyaho Server generates a unique Session ID, and passes to the user.
3. User integrates the Session ID with the current User information by calling a REST API of your own service server that you need to implement.
4. Service Server integrates User information with the Session by using `integrateUser` API of Mooyaho Server SDK.
5. User enters the channel by using `enter` API of Client SDK.
6. Connection between Client A and Client B is establishes. At this time, existing user (Client A) **offer**s and newly connected user **answer**s the WebRTC signal (For mor details about offer/answer, read [Designing the signaling protocol](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling#designing_the_signaling_protocol)). Mooyaho Client SDK handles all the offer, answer, and ICE Candidate signals internally.

If another user (e.g. Client C) enters the channel, it takes the same process. Client A and Client B will offer the WebRTC signal to Client C, and Client C will answer the offer.

## Scenario 2: Many to Many Video Chat (with SFU Server Enabled)

This section illustrates how Many to Many video chat works with Mooyaho with SFU Server enabled.

Channel creating process is similar to the scenario 1. You can create a channel with SFU Server enabled by calling `createChannel(true)`. This parameter represents `isSFU` flag. When Mooyaho server creates a channel with SFU Server enabled, channel will be binded to the SFU Server where least users are connected.

### 1. User enters the Channel

![User creates & enters the channel](/img/architecture/first-user-enters-channel-with-sfu.png)

1. User (Client A) connects to the Mooyaho Server.
2. Mooyaho Server generates a unique Session ID, and passes to the user.
3. User integrates the Session ID with the current User information by calling a REST API of your own service server that you need to implement.
4. Service Server integrates User information with the Session by using `integrateUser` API of Mooyaho Server SDK.
5. User enters the channel by using `enter` API of Client SDK. When user enters the channel, Mooyaho server will respond to the user that this channel is SFU enabled.
6. Connection between the User and SFU Server establishes. In this process, the user will send the offer WebRTC signal to the SFU Server. SFU server will answer the signal. This WebRTC connection is unidirectional; user sends his/her media stream to the SFU server. SFU server won't send and media stream to the user in this connection. Mooyaho Client SDK handles all the offer, answer, and ICE Candidate signals internally.

### 2. Second user enters the Channel

![Second user enters the Channel](/img/architecture/second-user-enters-channel-with-sfu.png)

Suppose a user (Client A) has already entered to a Mooyaho channel.

1. User (Client B) connects to the Mooyaho Server.
2. Mooyaho Server generates a unique Session ID, and passes to the user.
3. User integrates the Session ID with the current User information by calling a REST API of your own service server that you need to implement.
4. Service Server integrates User information with the Session by using `integrateUser` API of Mooyaho Server SDK.
5. User enters the channel by using `enter` API of Client SDK.
6. Connection between Client B and SFU Server establishes. Just as previous section, stream of this WebRTC connection is unidirectional. User sends his/her media stream to the SFU server.
7. After the WebRTC connection between Client B and SFU Server establishes, the SFU Server will send the offer WebRTC signal to each of the users. In this WebRTC connection, the SFU Server will send the media stream of the other user.

If another user (Client C) connects to the channel, the WebRTC connection will be established as below.

![Multiple SFU User](/img/architecture/multiple-sfu-connections.png)

SFU Server will forward the user's media stream to the other user. If there are N users, a user will send 1 media stream to the SFU Server, and user will recevie N - 1 media streams from the SFU Server.

## Scenario 3: One to One video chat

Compared to Many to Many video chat, One to One video chat does not require a channel to be created.

When you want to implement One to One video chat, you have to set `allowDirectCall` field to `true` in your config of Mooyaho Client SDK. Furthermore, you do not have to integrate user information when you implement one to one video chat.

#### Example

```javascript
const config = {
  url: 'ws://localhost:8081',
  allowDirectCall: true,
}

const mooyaho = new Mooyaho(config)
```

![Direct call](/img/architecture/direct-call.png)

1. User (Client A) connects to the Mooyaho Server.
2. Mooyaho Server generates a unique Session ID, and passes to the user.
3. User has to pass the Session ID to the Service Server. The Service Server should some how pass this Session ID to the another user (Client B). You have to implement this by a REST API or WebSocket yourself.
4. Another user (Client B) connects to the Mooyaho Server. Then, this user calls the `directCall` API of Mooyaho Client SDK. The parameter of this API should be the Session ID of the user to call (Client A).
5. WebRTC connection between Client A and Client B establishes.
