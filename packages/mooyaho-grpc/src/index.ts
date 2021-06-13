import path from 'path'
import * as protoLoader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'
import { ProtoGrpcType } from './protos/mooyaho'

const packageDef = protoLoader.loadSync(
  path.join(__dirname, '../protos/mooyaho.proto')
)
const proto: ProtoGrpcType = grpc.loadPackageDefinition(packageDef) as any

export * from './protos/mooyaho/Mooyaho'
export * from './Client'
export default proto
