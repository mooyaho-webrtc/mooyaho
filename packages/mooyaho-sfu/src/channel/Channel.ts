import Connection from './Connection'
import ConnectionManager from './ConnectionManager'

export default class Channel {
  connections = new ConnectionManager()

  constructor(private id: string) {}

  getConnectionById(id: string) {
    return this.connections.getConnectionById(id)
  }

  addConnection(connection: Connection) {
    connection.channel = this
    this.connections.add(connection.id, connection)
  }

  getConnectionsExcept(id: string) {
    return Array.from(this.connections.getAll()).filter(
      connection => connection.id !== id
    )
  }
}
