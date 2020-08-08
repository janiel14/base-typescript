import { Collection, ObjectId } from 'mongodb'
import { RequestAuth } from './types/utils/RequestAuth'
import { connectDb } from './Mongo'
export class Crud {
  private modelName: string
  public model: Collection
  public _beforeUpdate: any
  public _afterUpdate: any
  public _beforeInsert: any
  public _afterInsert: any
  public _beforeInsertMany: any
  public _afterInsertMany: any
  public _beforeUpdateMany: any
  public _afterUpdateMany: any
  public _beforeDelete: any
  public _afterDelete: any
  public _beforeDeleteMany: any
  public _afterDeleteMany: any
  public _beforeFindOne: any
  public _afterFindOne: any
  public _beforeFindAll: any
  public _afterFindAll: any
  public _beforePaginate: any
  public _afterPaginate: any
  public _beforeSearch: any
  public _afterSearch: any

  constructor(modelName: string) {
    this.modelName = modelName
  }

  public async getModel(): Promise<void> {
    const conn = await connectDb()
    this.model = conn.collection(this.modelName)
  }

  public async insertOrUpdate<T>(req: RequestAuth): Promise<T> {
    await this.getModel()
    if (req.body._id) {
      if (typeof this._beforeUpdate === 'function') {
        req.body = await this._beforeUpdate(req.body, req)
      }
      const query = {
        _id: new ObjectId(req.body._id),
        deletedAt: null
      }
      const updateData = req.body
      delete updateData._id
      delete updateData.updatedAt
      delete updateData.createdAt
      delete updateData.deletedAt
      await this.model.updateOne(query,
        {
          $set: updateData,
          $currentDate: {
            updatedAt: true
          }
        }
      )
      if (typeof this._afterUpdate === 'function') {
        return this._afterUpdate(req.body)
      }
      return req.body
    } else {
      if (typeof this._beforeInsert === 'function') {
        req.body = await this._beforeInsert(req.body, req)
      }
      req.body.createdAt = new Date()
      req.body.updatedAt = new Date()
      req.body.deletedAt = null
      const ds = await this.model.insertOne(req.body)
      if (typeof this._afterInsert === 'function') {
        return this._afterInsert(ds.ops[0])
      }
      return ds.ops[0]
    }
  }

  public async insertMany<T>(req: RequestAuth): Promise<T[]> {
    await this.getModel()
    if (typeof this._beforeInsertMany === 'function') {
      req.body = await this._beforeInsertMany(req.body, req)
    }
    req.body = req.body.map((item) => {
      return {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    })
    const ds = await this.model.insertOne(req.body)
    if (typeof this._afterInsertMany === 'function') {
      return this._afterInsertMany(ds.ops)
    }
    return ds.ops
  }

  public async updateMany<T>(req: RequestAuth): Promise<T[]> {
    await this.getModel()
    if (typeof this._beforeUpdateMany === 'function') {
      req.body = await this._beforeUpdateMany(req.body, req)
    }
    const ds = await this.model.updateMany(req.body.filter, {
      $set: req.body.data,
      $currentDate: {
        updatedAt: true
      }
    })
    if (typeof this._afterUpdateMany === 'function') {
      return this._afterUpdateMany(req.body.data)
    }
    return req.body.data
  }

  public async delete(req: RequestAuth): Promise<boolean> {
    await this.getModel()
    if (typeof this._beforeDelete === 'function') {
      req.params = await this._beforeDelete(req.params)
    }
    const query = {
      _id: new ObjectId(req.params._id),
      deletedAt: null
    }
    await this.model.updateOne(query, {
      $set: {
        deletedAt: new Date()
      },
      $currentDate: {
        updatedAt: true
      }
    })
    if (typeof this._afterDelete === 'function') {
      await this._afterDelete(req.params)
    }
    return true
  }

  public async deleteMany(req: RequestAuth): Promise<boolean> {
    await this.getModel()
    if (typeof this._beforeDeleteMany === 'function') {
      req.body = await this._beforeDeleteMany(req.body)
    }
    await this.model.updateMany(req.body.filter, {
      $set: {
        deletedAt: new Date()
      },
      $currentDate: {
        updatedAt: true
      }
    })
    if (typeof this._afterDeleteMany === 'function') {
      await this._afterDeleteMany(req.body)
    }
    return true
  }

  public async findOne<T>(req: any): Promise<T> {
    await this.getModel()
    if (typeof this._beforeFindOne === 'function') {
      req.params = await this._beforeFindOne(req.params, req)
    }
    const query = {
      _id: new ObjectId(req.params._id),
      deletedAt: null
    }
    const ds = await this.model.findOne(query)
    if (typeof this._afterFindOne === 'function') {
      return this._afterFindOne(ds)
    }
    return ds
  }

  public async findAll<T>(req: RequestAuth): Promise<T[]> {
    await this.getModel()
    if (typeof this._beforeFindAll === 'function') {
      req.body = await this._beforeFindAll(req.body, req)
    }
    req.body.filter.deletedAt = null
    const ds = await this.model
      .find(req.body.filter)
      .sort(req.body.sort).toArray()
    if (typeof this._afterFindAll === 'function') {
      return this._afterFindAll(ds)
    }
    return ds
  }

  public async paginage(req: RequestAuth): Promise<any> {
    await this.getModel()
    req.body.page = isNaN(req.body.page) ? 0 : req.body.page
    req.body.limit = isNaN(req.body.limit) ? 20 : req.body.limit
    req.body.sort = isNaN(req.body.sort) ? 1 : req.body.sort
    if (typeof this._beforePaginate === 'function') {
      req.body = await this._beforePaginate(req.body, req)
    }
    req.body.filter.deletedAt = null
    const cursor = this.model
    if (req.body.page === 2) {
      req.body.page = req.body.limit
    } else if (req.body.page >= 3) {
      req.body.page =
        (parseInt(req.body.page, 10) - 1) * parseInt(req.body.limit, 10)
    }
    const count = await cursor.count()
    const ds = await cursor
      .find(req.body.filter)
      .skip(parseInt(req.body.page, 10))
      .limit(parseInt(req.body.limit, 10))
      .sort(req.body.sort).toArray()
    if (typeof this._afterPaginate === 'function') {
      return this._afterPaginate(ds)
    }
    return {
      data: ds,
      page: req.body.page,
      limit: req.body.limit,
      sort: req.body.sort,
      total: count
    }
  }

}
