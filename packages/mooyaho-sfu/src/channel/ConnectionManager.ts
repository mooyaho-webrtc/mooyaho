import Connection from './Connection'

export default class ConnectionManager {
  connections = new Map<string, Connection>()

  constructor() {}

  getConnectionById(id: string) {
    let connection = this.connections.get(id)
    if (!connection) {
      connection = new Connection(id)
      this.connections.set(id, connection)
    }
    return connection
  }

  add(id: string, connection: Connection) {
    this.connections.set(id, connection)
  }

  getAll() {
    return this.connections.values()
  }

  remove(id: string) {
    this.connections.delete(id)
  }
}
