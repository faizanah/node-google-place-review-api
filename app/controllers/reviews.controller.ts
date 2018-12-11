const _ = require('lodash')
let params = {body: {}, condition: {}, pick: {}}
export class ReviewsController {
  constructor() {
  }
  create(req, res) {
    params.condition = {
      where: {googlePlaceId: req.body.googlePlaceId},
      defaults: {}
    }
    req.model('Place').findOrCreate(params, (data, isNew) => {
      req.body.createdById = req.user.id
      req.body.placeId = data.id
      params.condition = {}
      params.pick = ['createdById', 'placeId', 'body', 'isLiked']
      req.model('Review').create(params)
    })
  }
  show(req, res) {
    let options = {condition: {where: {id: req.params.id, createdById: req.user.id}, include: [{ all: true }]}}
    return req.model('Review').findOne(options)
  }
  list(req, res) {
    return req.db['Review'].findAll({ include: [{ all: true }] }).then(data => res.ok(data))
      .catch(error => res.handleError('Sequelize', error) )
  }
}
