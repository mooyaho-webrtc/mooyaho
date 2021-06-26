import { Signal } from 'mooyaho-grpc'

let dispatchSignal: Callback | null = null
export function registerDispatchSignal(callback: Callback) {
  dispatchSignal = callback
}

type Callback = (signal: Signal) => void

export default function getDispatchSignal() {
  if (!dispatchSignal) throw new Error('dispatchSignal is not registered')
  return dispatchSignal
}
