import * as multer from 'multer'
import * as aws from 'aws-sdk'
import * as multerS3 from 'multer-s3'
import { ENV } from './'
aws.config.update({
  secretAccessKey: ENV.aws.secretKey,
  accessKeyId: ENV.aws.accessKey,
  region: ENV.aws.region
})
const s3 = new aws.S3()
const limits = {
  files: 2, // allow only 1 file per request
  fileSize: 1024 * 1024 * 100, // 10 MB (max file size)
}
export function uploader(_file, res) {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: ENV.aws.s3Bucket,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function(req, file, cb) {
        cb(null, { fieldName: file.fieldname })
      },
      key: function(req, file, cb) {
        const newFileName = Date.now() + '-' + file.originalname
        const fullPath = _file + newFileName
        cb(null, fullPath)
      }
    }),
    limits: limits,
    fileFilter: function(req, file, cb) {
      const type = file.mimetype
      const typeArray = type.split('/')
      if (typeArray[0] === 'video' || typeArray[0] === 'image') {
        return cb(null, true)
      } else {
        return cb(new Error('Only images and videos files are allowed!'), false)
      }
    }
  })
}
