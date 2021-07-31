---
sidebar_position: 2
---

# Architecture

If you are using Mooyaho, you have to open following servers:

1. Mooyaho Server: This server will manage the sessions and the channels. This server provides REST API and WebSocket API. This server can be scaled up to multiple instances if you use a load balancer (Using AWS ElasticLoadbalancer or Nginx is recommended).
2. Redis Server: Mooyaho server uses a Redis server for channel subscription.
3. SFU Server: Using this server is optional. This server is used when you want to apply [SFU](https://webrtcglossary.com/sfu/) to the channel. You can have multiple SFU Servers.
4. Service Server: This is the server that you implement for your service. You can create a channel or integrate user authentication with Mooyaho sessions. If you do not have a server for your service, you can still use Mooyaho with `allowAnonymous` mode (this is INSECURE).

## Scenario 1: User Creates and Enters a Channel

![User creates & enters the channel](/img/architecture/create-and-enter-channel.png)

1. User creates a channel by calling a REST API of your own service server that you need to implement.
2. Service Server creates a channel by using `createChannel` API of Mooyaho Server SDK.
3. Mooyaho Server creates a channel and generates a unique Channel ID and responds to the Service Server.
4. Service Server now responds to the user and passes the Channel ID.
5. User connects to the Mooyaho Server.
6. Mooyaho Server generates a unique Session ID, and passes to the user.
7. User integrates thes Session ID with the current User information by calling a REST API of your own service server that you need to implement.
8. Service Server integrates User information with the Session by using `integrateUser` API of Mooyaho Server SDK.
9. Finally, the user enters the channel by using `enter` of Client SDK.

### Scenario 2: User Enters an Existing Channel

![User creates & enters the channel](/img/architecture/enter-existing-channel.png)

Suppose Client A is already connected to the Mooyaho Server.

1.
2.
3.
4.
5.
6.
