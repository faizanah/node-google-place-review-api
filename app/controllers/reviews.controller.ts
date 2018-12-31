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
                type: req.file.contentType,
                userId: req.user.id
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
    params.condition = {where: {'$or': [{id: req.params.placeId}, {googlePlaceId: req.params.placeId}]}, include: [ 'attachments', 'createdBy' ]}
    req.model('Review').findAll(params)
  }
  show(req, res) {
    params.condition = {where: {id: req.params.id}, include: [{ all: true }]}
    return req.model('Review').findOne(params)
  }
  report(req, res) {
    req.checkParams('reviewId', 'Enter a valid review ID.').notEmpty()
    req.check('issueId').notEmpty().withMessage('Issue id can\'t be blank')
    params.condition = {where: {id: req.params.reviewId}}
    return req.model('Review').findOne(params, (review => {
      if (review) {
        req.body.reviewId = review.id
        req.body.userId =  req.user.id
        req.model('ReviewReport').create({pick: ['userId', 'issueId', 'reviewId']})
      } else {
        res.notFound('Review not fount with this id.')
      }
    }))
  }
}
