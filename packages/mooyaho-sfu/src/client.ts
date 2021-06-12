import { Client } from 'mooyaho-grpc'

const client = new Client('localhost:50000')

client
  .call({
    sessionId: 'asdfasdfdasf',
    sdp: 'asdfsafsda',
  })
  .then(console.log)
