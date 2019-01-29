import * as winston from 'winston'
import * as controller from '../controllers'
import { requiresAuth, swagger, swaggerDocs } from '../config/'
const passportConf = require('../config/passport')
export function initRoutes(app, router) {
  winston.log('info', '--> Initialisations the routes')
  let apiRoute = router
  // apiRoute.get('/', (req, res) => res.status(200).send({message: 'Api Server is running!'}))
  apiRoute.get('/', (req, res) => {
    return res.redirect('/docs')
  })
  apiRoute.use('/docs', swagger, swaggerDocs)
  apiRoute.post('/v1/login', controller.session.login)
  apiRoute.post('/v1/signup/', controller.registration.signup)
  apiRoute.post('/v1/password/reset', controller.password.create)
  apiRoute.route('/v1/auth/facebook').post(controller.session.facebook)
  apiRoute.route('/v1/places/').post(controller.places.create)
  apiRoute.use(requiresAuth())
  apiRoute.route('/v1/places/').get(controller.places.list)
  apiRoute.route('/v1/places/:id').get(controller.places.show)
  apiRoute.get('/v1/users/', controller.users.list)
  apiRoute.route('/v1/password/change').post(controller.password.update)
  apiRoute.route('/v1/me').get(controller.users.me).patch(controller.users.update)
  apiRoute.route('/v1/users/:id').get(controller.users.show)
  apiRoute.route('/v1/users/:userId/reviews').get(controller.users.reviews)
  apiRoute.route('/v1/users/:userId/attachments').get(controller.users.attachments)
  apiRoute.route('/v1/reviews/:id').get(controller.reviews.show)
  apiRoute.route('/v1/reviews/:reviewId/report').post(controller.reviews.report)
  apiRoute.route('/v1/places/:placeId/reviews').post(controller.reviews.create).get(controller.reviews.list)
  apiRoute.route('/v1/issues').get(controller.issues.list)
  return apiRoute
}
