import fs from 'fs'
import path from 'path'

type MooyahoConfig = {
  allowAnonymous: boolean
}

let config: MooyahoConfig | null = null

async function loadConfig() {
  const configDir = path.resolve(__dirname, '../mooyaho.config.json')
  const file = fs.readFileSync(configDir, 'utf8')
  config = JSON.parse(file)
}

loadConfig()

export default config!
