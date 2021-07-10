import Mooyaho, { MooyahoConfig } from 'mooyaho-client-sdk'

const config: MooyahoConfig = {
  url: 'ws://localhost:8081',
}

console.log(config)
const mooyaho = new Mooyaho(config)
