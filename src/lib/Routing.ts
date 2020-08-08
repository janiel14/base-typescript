import { Helpers } from './Helpers'
import { Response, Router } from 'express'
import { RequestAuth } from './types/utils/RequestAuth'
import { Logger } from './Logger'

export class Routing {
  public helpers: Helpers
  public controller: any
  public r: Router

  constructor(name: string, controller: any) {
    this.helpers = new Helpers()
    this.controller = controller
    this.r = Router()
    this.r
      .route(`/${name}`)
      .post(this.helpers.ensureAuthenticateJWT, async (req: RequestAuth, res: Response) => {
        try {
          let response = null
          switch (req.body.method) {
            case 'insertOrUpdate':
              response = await this.controller.insertOrUpdate(req)
              break
            case 'insertMany':
              response = await this.controller.insertMany(req)
              break
            case 'updateMany':
              response = await this.controller.updateMany(req)
              break
            case 'delete':
              response = await this.controller.delete(req)
              break
            case 'deleteMany':
              response = await this.controller.deleteMany(req)
              break
            case 'findOne':
              response = await this.controller.findOne(req)
              break
            case 'findAll':
              response = await this.controller.findAll(req)
              break
            case 'paginage':
              response = await this.controller.paginage(req)
              break
            default:
              break
          }
          res.status(200).json(response)
        } catch (error) {
          Logger.error(`${name.toLocaleUpperCase()}_ERROR`, 'error on request route', error)
          res.status(500).json(error.message)
        }
      })
  }
}
