import * as express from 'express'
import * as winston from 'winston'
import * as boom from 'express-boom'
import * as morgan from 'morgan'
import * as cors from 'cors'
import * as expressValidator from 'express-validator'
import { json, urlencoded } from 'body-parser'
import { Express } from 'express'
import * as routes from './routes/'
import {environment} from './config/'
import { activerecord } from './config/middlewares'
const path = require('path')
import db from './models/'
const PORT: number = environment.port || 3000
// Swagger definition

export class Server {

  private app: Express

  constructor() {
    this.app = express()
    // Express middleware
    this.app.use(cors({
      optionsSuccessStatus: 200,
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      exposedHeaders: ['x-access-token']
    }))
    this.app.use(urlencoded({
      extended: true
    }))
    this.app.use(json())
    this.app.use(boom())
    this.app.use(morgan('combined'))
    this.app.use(expressValidator())
    this.app.use(activerecord)
    this.app.use(express.static('public'))
    const self = this.app
    db['sequelize'].sync().then(function(){
      self.listen(PORT, () => {
        routes.initRoutes(self)
        winston.log('info', '--> Server successfully started at port %d', PORT)
      })
    })
  }

  getApp() {
    return this.app
  }
}
new Server()
