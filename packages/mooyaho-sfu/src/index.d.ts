declare module 'wrtc' {
  export var RTCPeerConnection: {
    prototype: RTCPeerConnection
    new (configuration?: RTCConfiguration): RTCPeerConnection
    generateCertificate(
      keygenAlgorithm: AlgorithmIdentifier
    ): Promise<RTCCertificate>
    getDefaultIceServers(): RTCIceServer[]
  }
}
