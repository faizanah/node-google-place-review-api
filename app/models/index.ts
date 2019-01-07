require('dotenv').config()
import { ENV } from '../config'
import * as fs from 'fs'
import * as path from 'path'
import * as Sequelize from 'sequelize'
const basename = path.basename(module.filename)
const sequelize = new Sequelize(ENV.DATABASE_URL || process.env.DATABASE_URL)
let db = {}
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(function(file) {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model['name']] = model
  })
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db['sequelize'] = sequelize
db['Sequelize'] = Sequelize

export default db
