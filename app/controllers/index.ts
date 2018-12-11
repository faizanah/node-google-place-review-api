import ApplicationController from './application.controller'
import { UsersController } from './users.controller'
import { RegistrationController } from './registration.controller'
import { SessionController } from './session.controller'
import { PasswordController } from './password.controller'
import { ReviewsController } from './reviews.controller'
import { PlacesController } from './places.controller'

export {ApplicationController, UsersController, RegistrationController, SessionController, PasswordController, ReviewsController, PlacesController}

// var fs = require('fs');
// function getUrl(url) {
//   return '/api' + url;
// }
// let routes = {}
// fs
//   .readdirSync(__dirname)
//   .filter(function(file) {
//     return (file.indexOf('.') !== 0) && (file !== 'index.js')
//   })
//   .forEach(function(file){
//     let name = file.replace('.js', '')
//     let controller = require(__dirname + '/' + name)
//     routes[name] = new controller()
//   })
//
// module.exports = routes
