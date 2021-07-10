const sleep = (time: number) =>
  new Promise(resolve => {
    setTimeout(resolve, time)
  })

export function waitUntil(fn: () => boolean, timeout: number = 10000) {
  return new Promise<void>(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('waitUntil timed out'))
    }, timeout)
    while (!fn()) {
      await sleep(50)
    }
    clearTimeout(timeoutId)
    resolve()
  })
}
