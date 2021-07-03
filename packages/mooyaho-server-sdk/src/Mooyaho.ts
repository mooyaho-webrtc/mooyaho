import axios from 'axios'

const apiClient = axios.create()

class Mooyaho {
  constructor(apiKey: string) {
    apiClient.defaults.headers['Authoriaztion'] = `Bearer ${apiKey}`
  }
}

export default Mooyaho
