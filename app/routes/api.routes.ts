import * as winston from 'winston'
import {UsersController, RegistrationController, SessionController, PasswordController, ReviewsController, PlacesController} from '../controllers'
import { verifyJWT_MW } from '../config/middlewares'
// import { custom } from '../config/custom'
const passportConf = require('../config/passport')
import {swagger, swaggerDocs} from '../config/swagger'

export function initRoutes(app, router) {
  winston.log('info', '--> Initialisations des routes')
  let apiRoute = router
  const users = new UsersController()
  const registration = new RegistrationController()
  const session = new SessionController()
  const password = new PasswordController()
  const review = new ReviewsController()
  const place = new PlacesController()
  // apiRoute.get('/', (req, res) => res.status(200).send({message: 'Api Server is running!'}))
  // apiRoute.route('*').all(custom)
  apiRoute.use('/docs', swagger, swaggerDocs)
  apiRoute.post('/v1/login', session.login)
  apiRoute.post('/v1/signup/', registration.signup)
  apiRoute.post('/v1/password/reset', password.create)
  apiRoute.route('/v1/auth/facebook').post(session.facebook)
  apiRoute.route('*').all(verifyJWT_MW)
  apiRoute.get('/v1/users/',  users.list)
  apiRoute.get('/v1/me',  users.me)
  apiRoute.route('/v1/reviews').post(review.create).get(review.list)
  apiRoute.route('/v1/reviews/:id').get(review.show)
  apiRoute.route('/v1/places/:id').get(place.show)
  apiRoute.route('/v1/places/').get(place.list).post(place.create)
  return apiRoute
}
