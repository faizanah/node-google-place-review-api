import * as winston from 'winston'
import {UsersController, RegistrationController, SessionController, PasswordController, ReviewsController, PlacesController, IssuesController} from '../controllers'
import { verifyJWT_MW } from '../config/middlewares'
import {swagger, swaggerDocs} from '../config/swagger'

export function initRoutes(app, router) {
  winston.log('info', '--> Initialisations the routes')
  let apiRoute = router
  const users = new UsersController()
  const registration = new RegistrationController()
  const session = new SessionController()
  const password = new PasswordController()
  const review = new ReviewsController()
  const place = new PlacesController()
  const issues = new IssuesController()
  apiRoute.get('/', (req, res) => res.status(200).send({message: 'Api Server is running!'}))
  apiRoute.use('/docs', swagger, swaggerDocs)
  apiRoute.post('/v1/login', session.login)
  apiRoute.post('/v1/signup/', registration.signup)
  apiRoute.post('/v1/password/reset', password.create)
  apiRoute.route('/v1/auth/facebook').post(session.facebook)
  apiRoute.route('/v1/places/').get(place.list).post(place.create)
  apiRoute.route('/v1/places/:id').get(place.show)
  apiRoute.route('*').all(verifyJWT_MW)
  apiRoute.route('/v1/places/:id').get(place.show)
  apiRoute.route('/v1/places/').get(place.list).post(place.create)
  apiRoute.get('/v1/users/',  users.list)
  apiRoute.route('/v1/me').get(users.me).post(users.update)
  apiRoute.route('/v1/users/:id').get(users.show)
  apiRoute.route('/v1/users/:userId/reviews').get(users.reviews)
  apiRoute.route('/v1/users/:userId/attachments').get(users.attachments)
  apiRoute.route('/v1/reviews/:id').get(review.show)
  apiRoute.route('/v1/places/:placeId/reviews').post(review.create).get(review.list)
  apiRoute.route('/v1/issues').get(issues.list)
  return apiRoute
}
