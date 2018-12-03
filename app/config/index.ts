const env     = process.env.NODE_ENV || 'development'
import Mailer from './mailer'
const environment  = require('./environment')[env]
export { environment, Mailer };
