let params = {body: {}, condition: {}, pick: ['createdById', 'placeId', 'body', 'isLiked', 'googlePlaceId']}

export class ReviewsController {
  constructor() {}
  create(req, res) {
    req.checkParams('placeId', 'Enter a valid Google Place ID.').notEmpty()
    req.check('body').notEmpty().withMessage('Review Body can\'t be blank').isLength({min: 3, max: 140}).withMessage('Review Body must be between 3 to 140 characters.')
    req.check('isLiked').isBoolean().withMessage('Review liked must be boolean value.')
    params.condition = {where: {googlePlaceId: req.params.placeId}, defaults: {}}
    req.model('Place').findOrCreate(params, (place, isNew) => {
      req.body.createdById = req.user.id
      req.body.placeId = place.id
      req.body.googlePlaceId = place.googlePlaceId
      req.model('Review').create(params)
    })
  }
  list(req, res) {
    params.condition = {where: {'$or': [{id: req.params.placeId}, {googlePlaceId: req.params.placeId}]}}
    req.model('Review').findAll(params)
  }
  show(req, res) {
    params.condition = {where: {id: req.params.id, createdById: req.user.id}, include: [{ all: true }]}
    return req.model('Review').findOne(params)
  }
}
