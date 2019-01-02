import { UsersController } from './users.controller'
import { RegistrationController } from './registration.controller'
import { SessionController } from './session.controller'
import { PasswordController } from './password.controller'
import { ReviewsController } from './reviews.controller'
import { PlacesController } from './places.controller'
import { IssuesController } from './issues.controller'

export const users = new UsersController()
export const registration = new RegistrationController()
export const session = new SessionController()
export const password = new PasswordController()
export const reviews = new ReviewsController()
export const places = new PlacesController()
export const issues = new IssuesController()

// import * as camelCase from 'camelcase'
// import * as fs from 'fs'
// import * as path from 'path'
// let controller = {}
// fs
//   .readdirSync(__dirname)
//   .filter(function(file) {
//     let name = file.split('.')
//     return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'index.js.map') && (name[3] !== 'map')
//   })
//   .forEach(function(file){
//     let name = file.split('.')
//     let controllerName = camelCase([name[0], 'Controller'], {pascalCase: true})
//     let fileName = './' + file.replace('.js', '')
//     console.log('Name: ' + name[0])
//     console.log('Path: ' + fileName)
//     console.log('Controller: ' + controllerName)
//     let cc = require(fileName)[controllerName]
//     controller[name[0]] = new cc()
//   })
// console.log(JSON.stringify(controller, null, 2))
// export default controller
