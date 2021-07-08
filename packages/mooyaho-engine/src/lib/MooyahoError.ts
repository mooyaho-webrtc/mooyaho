export class MooyahoError extends Error {
  statusCode: number = 400
  constructor(params: ErrorParams) {
    super(params.message)
    params.name = params.name
    if (params.statusCode) {
      this.statusCode = params.statusCode
    }
  }
}

type ErrorName = 'Not Found' | 'Bad Request' | 'Unauthorized' | 'Internal Error'

type ErrorParams = {
  statusCode?: number
  message: string
  name: ErrorName
}

export function isMooyahoError(e: any): e is MooyahoError {
  console.log(e instanceof MooyahoError)
  return e instanceof MooyahoError
}
