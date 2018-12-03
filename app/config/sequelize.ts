import * as Sequelize from 'sequelize'
require('dotenv').config()
import {environment} from './'
console.log(JSON.stringify('Environment' + environment, null, 2))
export const sequelize = new Sequelize(environment.DATABASE_URL || process.env.DATABASE_URL)
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
