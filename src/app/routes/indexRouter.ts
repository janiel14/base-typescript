import { Response, Request, Router } from 'express'
import { IndexController } from '../controllers/indexController'

export class IndexRouter {
  public r: Router

  constructor() {
    this.r = Router()
    this.r.route('*')
      .all((req: Request, res: Response) => {
        res.status(200).json(new IndexController().loggerAllRequest(req))
      })
  }
}
