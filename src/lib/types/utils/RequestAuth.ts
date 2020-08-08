import { Request } from 'express'

export interface BaseAuthClient {
  user: object
}

export interface RequestAuth extends Request {
  authClient: BaseAuthClient
}
