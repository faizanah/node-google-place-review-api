require('dotenv').config()
const environment = require('./environment')[(process.env.NODE_ENV)]
const ENV = environment
import Mailer from './mailer'
import { responses } from './responses'
import { requiresAuth } from './auth'
import { ORM } from './orm'
import { swagger, swaggerDocs } from '../config/swagger'
export { environment, Mailer, responses, ORM, requiresAuth, swagger, swaggerDocs, ENV }
