import { Logger } from '../../lib/Logger'
import { Request } from 'express'

export class IndexController {

  public defaultRoute(): object {
    return {
      message: 'Hello word'
    }
  }

  public loggerAllRequest(req: Request): object {
    Logger.log('REQUEST', 'REQ', req)
    Logger.log('REQUEST', 'BODY', req.body)
    Logger.log('REQUEST', 'PARAMS', req.params)
    Logger.log('REQUEST', 'QUERY', req.params)
    return {
      message: 'Thanks apn ok'
    }
  }

}
