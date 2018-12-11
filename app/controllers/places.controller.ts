let params = {body: {}, condition: {}, pick: {}}
export class PlacesController {
  constructor() {}
  create(req, res) {
    params.condition = {where: {googlePlaceId: req.body.googlePlaceId}, defaults: {}}
    req.model('Place').findOrCreate(params)
  }
  show(req, res) {
    params.condition = {where: {'$or': [{id: req.params.id}, {googlePlaceId: req.params.id}]}, include: [{ all: true }]}
    return req.model('Place').findOne(params)
  }
  list(req, res) {
    params.condition = { include: [{ all: true }] }
    return req.model('Place').findAll(params)
  }
}
