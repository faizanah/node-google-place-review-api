let params = {body: {}, condition: {}, pick: ['createdById', 'placeId', 'body', 'isLiked', 'attachments', 'googlePlaceId'], include: {}}
import {uploader} from '../config/upload'

export class ReviewsController {
  constructor() {}
  create(req, res) {
    req.checkParams('placeId', 'Enter a valid Google Place ID.').notEmpty()
    params.condition = {where: {googlePlaceId: req.params.placeId}, defaults: {}}
    req.model('Place').findOrCreate(params, (place, isNew) => {
      if (place) {
        const storeDir = 'uploads/reviews/'
        const upload = uploader(storeDir, res).single('attachment')
        upload(req, res, function(err) {
          if (err) {
            return res.status(422).send({success: false, errors: err })
          }
          if (req.file) {
            req.check('body').notEmpty().withMessage('Review Body can\'t be blank').isLength({min: 3, max: 140}).withMessage('Review Body must be between 3 to 140 characters.')
            req.check('isLiked').isBoolean().withMessage('Review liked must be boolean value.')
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
            params.include = {include: ['attachments']}
            req.model('Review').create(params)
          } else {
            res.unprocessableEntity('Review attachment is required.')
          }
        })
      } else {
        res.notFound('Place not found')
      }
    })
  }
  list(req, res) {
    params.condition = {where: {'$or': [{id: req.params.placeId}, {googlePlaceId: req.params.placeId}]}, include: [{ all: true }]}
    req.model('Review').findAll(params)
  }
  show(req, res) {
    params.condition = {where: {id: req.params.id, createdById: req.user.id}, include: [{ all: true }]}
    return req.model('Review').findOne(params)
  }
}
