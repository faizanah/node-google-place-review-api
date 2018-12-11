let params = {body: {}, condition: {}, pick: {}}
export class PlacesController {
  constructor() {
  }
  create(req, res) {
    params.condition = {
      where: {googlePlaceId: req.body.googlePlaceId},
      defaults: {}
    }
    req.model('Place').findOrCreate(params)
  }
  show(req, res) {
    let options = {condition: {where: {'$or': [{id: req.params.id}, {googlePlaceId: req.params.id}]}, include: [{ all: true }]}}
    return req.model('Place').findOne(options)
  }
  list(req, res) {
    return req.db['Place'].findAll({ include: [{ all: true }] }).then(data => res.ok(data))
      .catch(error => res.handleError('Sequelize', error) )
  }
}
