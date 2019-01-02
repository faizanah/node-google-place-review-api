import * as express from 'express'
import * as winston from 'winston'
import * as boom from 'express-boom'
import * as morgan from 'morgan'
import * as cors from 'cors'
const expressValidator = require('express-validator')
import * as bodyParser from 'body-parser'
import { Express } from 'express'
import * as routes from './routes/'
import {environment, ORM, responses} from './config/'
import db from './models/'
const PORT: number = environment.port || 3000

export class Server {

  private app: Express

  constructor() {
    this.app = express()
    this.config()
    this.routes()
  }
  private config(): void {
    this.app.use(cors({
      optionsSuccessStatus: 200,
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      exposedHeaders: ['x-access-token']
    }))
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({extended: true}))
    this.app.use(expressValidator())
    this.app.use(boom())
    this.app.use(morgan('combined'))
    this.app.use(responses)
    this.app.use(this.locals)
    this.app.use(express.static('public'))
  }
  private routes(): void {
    const self = this.app
    db['sequelize'].sync().then(function(){
      self.listen(PORT, () => {
        routes.initRoutes(self)
        winston.log('info', '--> Server successfully started at port %d', PORT)
      })
    })
  }

  private locals(req, res, next) {
    req.env = environment
    req.db = db
    req.model = (table: string) => {
      return new ORM(table, req, res, next)
    }
    next()
  }

  getApp() {
    return this.app
  }
}
new Server()
