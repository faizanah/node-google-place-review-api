let params = {body: {}, condition: {}, pick: {}}
export class PlacesController {
  constructor() {}
  create(req, res) {
    params.condition = {
      where: {googlePlaceId: req.body.googlePlaceId},
      defaults: {
        name: req.body.name,
        contact: req.body.contact,
        address: req.body.address,
        longitude: req.body.longitude,
        latitude: req.body.latitude
      }
    }
    req.model('Place').findOrCreate(params, (place, isNew) => {
      if (!isNew) {
        place.update(params.condition['defaults']).then(() => {
          res.ok(place)
        })
      }else {
        res.ok(place)
      }
    })
  }
  show(req, res) {
    params.condition = {where: {'$or': [{id: req.params.id}, {googlePlaceId: req.params.id}]}, include: [{ all: true }]}
    return req.model('Place').findOne(params)
  }
  list(req, res) {
    return req.model('Place').findAll(params)
  }
}
