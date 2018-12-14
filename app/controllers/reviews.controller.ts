
let params = {body: {}, condition: {}, pick: ['createdById', 'placeId', 'body', 'isLiked']}
import {environment} from '../config'

// const multer = require('multer')
// // const upload = multer({ dest: './uploads/' }).array('userPhoto', 2)
// const storage = multer.diskStorage({
//   destination: function(req, file, cb){
//     console.log('Destination is: ' + JSON.stringify(file, null, 2))
//     cb(null, 'public/uploads/')
//   },
//   filename: function(req, file, cb){
//     cb(null, Date.now() + file.originalname)
//
//   }
// })
// const upload = multer({ storage: storage }).any()

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
aws.config.update({
  secretAccessKey: environment.aws.secretKey,
  accessKeyId: environment.aws.accessKey,
  region: environment.aws.region
})

const s3 = new aws.S3()

function uploadS3 (_file) {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: environment.aws.s3Bucket,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname })
      },
      key: function (req, file, cb) {
        console.log(file)
        const newFileName = Date.now() + '-' + file.originalname
        const fullPath = _file + file.fieldname + '/' + newFileName
        cb(null, fullPath)
      }
    })
  })
}

export class ReviewsController {
  constructor() {}
  create(req, res) {
    console.log('PARAMS is:' + JSON.stringify(req.params, null, 2))
    console.log('Body is:' + JSON.stringify(req.body, null, 2))
    console.log('Query is:' + JSON.stringify(req.query, null, 2))
    params.condition = {where: {'$or': [{id: req.params.placeId}, {googlePlaceId: req.params.placeId}]}}
    return req.model('Place').findOne(params, function (place) {
      if (place) {
        req.body.createdById = req.user.id
        req.body.placeId = place.id
        req.body.googlePlaceId = place.googlePlaceId
        params.condition = {}
        req.model('Review').create(params, function (review) {
          const storeDir = 'uploads/reviews/' + review.id
          const upload = uploadS3(storeDir).single('image')
          upload(req, res, function(err) {
            console.log('Body is: ' + JSON.stringify(req.body, null, 2))
            console.log(req.files)
            if (err) {
              return res.status(422).send({errors: err })
            }
            return res.json({'imageUrl': req.file.location})
          })
          res.created(review, {message: 'Review successfully posted.'})
        })
      } else {
        res.notFound('Place not found')
      }
    })
  }
  show(req, res) {
    params.condition = {where: {id: req.params.id, createdById: req.user.id}, include: [{ all: true }]}
    return req.model('Review').findOne(params)
  }
}
