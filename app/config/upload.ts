import * as multer from 'multer'
import * as aws from 'aws-sdk'
import * as multerS3 from 'multer-s3'
import {environment} from './'
aws.config.update({
  secretAccessKey: environment.aws.secretKey,
  accessKeyId: environment.aws.accessKey,
  region: environment.aws.region
})
const s3 = new aws.S3()
const limits = {
  files: 1, // allow only 1 file per request
  fileSize: 1024 * 1024 * 100, // 10 MB (max file size)
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
        const newFileName = Date.now() + '-' + file.originalname
        const fullPath = _file  + newFileName
        cb(null, fullPath)
      }
    }),
    limits: limits,
    fileFilter: function(req, file, cb) {
      const type = file.mimetype
      const typeArray = type.split('/')
      if (typeArray[0] === 'video' || typeArray[0] === 'image') {
        return  cb(null, true)
      }else {
        cb(null, false)
      }
    }
  })
}
