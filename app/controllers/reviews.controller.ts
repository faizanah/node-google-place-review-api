let params = {body: {}, condition: {}, pick: ['createdById', 'placeId', 'body', 'isLiked', 'attachments', 'googlePlaceId'], include: {}}
import {uploader} from '../config/upload'

export class ReviewsController {
  constructor() {}
  create(req, res) {
    const storeDir = 'uploads/reviews/'
    const upload = uploader(storeDir, res).single('attachment')
    params.condition = {where: {'$or': [{id: req.params.placeId}, {googlePlaceId: req.params.placeId}]}}
    return req.model('Place').findOne(params, function (place) {
      if (place) {
        upload(req, res, function(err) {
          if (err) {
            return res.status(422).send({success: false, errors: err })
          }
          console.log(JSON.stringify(req.file, null, 2))
          req.body = {
            createdById: req.user.id,
            placeId: place.id,
            googlePlaceId: place.googlePlaceId,
            isLiked: req.body.isLiked,
            body: req.body.body,
            attachments: [{
              file: req.file.location,
              name: req.file.originalname,
              size: req.file.size,
              type: req.file.contentType
            }]
          }
          params.condition = {}
          params.include = { include: [ 'attachments' ] }
          req.model('Review').create(params)
        })
      } else {
        res.notFound('Place not found')
      }
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
