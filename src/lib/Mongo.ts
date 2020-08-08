import { MongoClient, Db } from 'mongodb'
import { Logger } from './Logger'

export let mongoConn: MongoClient = null

export const connectDb = async (): Promise<Db> => {
  try {
    const uri = process.env.NODE_MONGO_URL || 'mongodb://localhost/test'
    const options = { useNewUrlParser: true, useUnifiedTopology: true }
    if (mongoConn) {
      if (!mongoConn.isConnected()) {
        mongoConn = await MongoClient.connect(uri, options)
        Logger.info('MONGO', `Mongo connected`)
      }
    } else {
      mongoConn = await MongoClient.connect(uri, options)
      Logger.info('MONGO', `Mongo connected`)
    }
    return mongoConn.db()
  } catch (error) {
    Logger.error('MONGO_ERROR', `Mongo.connectDb`, error)
  }
}

export const disconnectDb = async (): Promise<void> => {
  try {
    if (mongoConn.isConnected()) {
      mongoConn.close()
    }
  } catch (error) {
    Logger.error('MONGO_ERROR', `Mongo.disconnectDb`, error)
  }
}
