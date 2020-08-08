import http from 'http'
import { Express } from './lib/Express'
import { Logger } from './lib/Logger'
import { disconnectDb, mongoConn } from './lib/Mongo'

const express = new Express()
const serverHttp = http.createServer(express.app)
serverHttp.listen(express.port, () => {
  Logger.info('START', `Express Server listen: ${express.port}`)
})

process.on('beforeExit', () => {
  if (mongoConn.isConnected()) {
    disconnectDb()
  }
})
