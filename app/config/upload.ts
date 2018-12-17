import * as multer from 'multer'
import * as aws from 'aws-sdk'
import * as multerS3 from 'multer-s3'
import * as path from 'path'
import {environment} from '../config'
const { parse } = require('querystring')
aws.config.update({
  secretAccessKey: environment.aws.secretKey,
  accessKeyId: environment.aws.accessKey,
  region: environment.aws.region
})
const s3 = new aws.S3()
const limits = {
  files: 1, // allow only 1 file per request
  fileSize: 1024 * 1024 * 10, // 10 MB (max file size)
}
export function uploader (_file, res) {
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
    }),
    limits: limits,
    fileFilter: function(req, file, cb) {
      console.log('Multer Body is: ' + JSON.stringify(req.body, null, 2))
      req.getValidationResult().then((result) => {
        if (result.isEmpty()) {
          const type = file.mimetype
          const typeArray = type.split('/')
          if (typeArray[0] === 'video' || typeArray[0] === 'image') {
            return  cb(null, true)
          }else {
            cb(null, false)
          }
        } else {
          res.handleError('Validation', result)
        }
      })
    },
  })
}
