let params = {body: {}, condition: {}, pick: ['createdById', 'placeId', 'body', 'isLiked']}

export class ReviewsController {
  constructor() {}
  create(req, res) {
    params.condition = {where: {googlePlaceId: req.body.googlePlaceId}, defaults: {}}
    req.model('Place').findOrCreate(params, (data, isNew) => {
      req.body.createdById = req.user.id
      req.body.placeId = data.id
      params.condition = {}
      req.model('Review').create(params)
    })
  }
  show(req, res) {
    params.condition = {where: {id: req.params.id, createdById: req.user.id}, include: [{ all: true }]}
    return req.model('Review').findOne(params)
  }
}
