let params = { body: {}, condition: {}, pick: ['createdById', 'placeId', 'body', 'isLiked', 'attachments', 'googlePlaceId'], include: {} }
import { uploader } from '../config/upload'

export class ReviewsController {
  constructor() { }
  create(req, res) {
    const self = this
    req.checkParams('placeId', 'Enter a valid Google Place ID.').notEmpty()
    params.condition = { where: { googlePlaceId: req.params.placeId }, defaults: {} }
    req.model('Place').findOrCreate(params, (place, isNew) => {
      if (place) {
        const storeDir = 'uploads/reviews/'
        // const upload = uploader(storeDir, res).single('attachment')
        const upload = uploader(storeDir, res).fields([{ name: 'attachment', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }])
        upload(req, res, function(err) {
          if (err) {
            return res.status(422).send({ success: false, errors: err })
          }
          if (req.files['attachment'][0]) {
            req.check('body').notEmpty().withMessage('Review Body can\'t be blank').isLength({ min: 3, max: 140 }).withMessage('Review Body must be between 3 to 140 characters.')
            req.check('isLiked').isBoolean().withMessage('Review liked must be boolean value.')
            // req.body = self.sanitizeBody(req, place)
            params.condition = {}
            params.include = { include: ['attachments'] }
            let attachment = {
              file: req.files['attachment'][0].location,
              name: req.files['attachment'][0].originalname,
              size: req.files['attachment'][0].size,
              contentType: req.files['attachment'][0].contentType,
              userId: req.user.id
            }
            if (req.files['thumbnail'] && req.files['thumbnail'][0] && attachment.contentType.split('/')[0] === 'video') {
              const thumbnail = req.files['thumbnail'][0]
              params.include = {
                include: [{
                  association: 'attachments',
                  include: [{ model: req.db['Attachment'], as: 'thumbnails' }]
                }]
              }
              attachment['thumbnails'] = [{
                file: thumbnail.location,
                name: thumbnail.originalname,
                size: thumbnail.size,
                contentType: thumbnail.contentType,
                userId: req.user.id
              }]
            }
            req.body = {
              createdById: req.user.id,
              placeId: place.id,
              googlePlaceId: place.googlePlaceId,
              isLiked: req.body.isLiked,
              body: req.body.body,
              attachments: attachment
            }
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
    params.condition = {
      where: { '$or': [{ placeId: req.params.placeId }, { googlePlaceId: req.params.placeId }] }, include: [{
        model: req.db['Attachment'],
        as: 'attachments',
        include: ['thumbnails']
      }, { model: req.db['User'], as: 'createdBy' }]
    }
    req.model('Review').findAll(params)
  }
  show(req, res) {
    params.condition = {
      where: { id: req.params.id }, include: [{
        model: req.db['Attachment'],
        as: 'attachments',
        include: ['thumbnails'],
      },
      { model: req.db['Place'], as: 'place' },
      { model: req.db['User'], as: 'createdBy' },
      ]
    }
    return req.model('Review').findOne(params)
  }
  report(req, res) {
    req.checkParams('reviewId', 'Enter a valid review ID.').notEmpty()
    req.check('issueId').notEmpty().withMessage('Issue id can\'t be blank')
    params.condition = { where: { id: req.params.reviewId } }
    return req.model('Review').findOne(params, (review => {
      if (review) {
        req.body.reviewId = review.id
        req.body.userId = req.user.id
        req.model('ReviewReport').create({ pick: ['userId', 'issueId', 'reviewId'] })
      } else {
        res.notFound('Review not fount with this id.')
      }
    }))
  }

  sanitizeBody(req, place) {
    params.condition = {}
    params.include = { include: ['attachments'] }
    let attachment = {
      file: req.files['attachment'][0].location,
      name: req.files['attachment'][0].originalname,
      size: req.files['attachment'][0].size,
      contentType: req.files['attachment'][0].contentType,
      userId: req.user.id
    }
    const thumbnail = req.files['thumbnail'][0]
    if (attachment.contentType.split('/')[0] === 'video') {
      params.include = {
        include: [{
          association: 'attachments',
          include: [{ model: req.db['Attachment'], as: 'thumbnails' }]
        }]
      }
      attachment['thumbnails'] = [{
        file: thumbnail.location,
        name: thumbnail.originalname,
        size: thumbnail.size,
        contentType: thumbnail.contentType,
        userId: req.user.id
      }]
    }
    return {
      createdById: req.user.id,
      placeId: place.id,
      googlePlaceId: place.googlePlaceId,
      isLiked: req.body.isLiked,
      body: req.body.body,
      attachments: attachment
    }
  }
}
