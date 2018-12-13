let params = {body: {}, condition: {}, pick: ['createdById', 'placeId', 'body', 'isLiked']}
const multer = require('multer')
// const upload = multer({ dest: './uploads/' }).array('userPhoto', 2)
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    console.log('Destination is: ' + JSON.stringify(file, null, 2))
    cb(null, 'public/uploads/')
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + file.originalname)

  }
})
const upload = multer({ storage: storage }).any()
export class ReviewsController {
  constructor() {}
  create(req, res) {
    upload(req, res, function(err) {
      console.log('Body is: ' + JSON.stringify(req.body, null, 2))
      console.log(req.files)
      if (err) {
        return res.end('Error uploading file.')
      }
      res.end('File is uploaded')
    })
    // params.condition = {where: {googlePlaceId: req.body.googlePlaceId}, defaults: {}}
    // req.model('Place').findOrCreate(params, (data, isNew) => {
    //   req.body.createdById = req.user.id
    //   req.body.placeId = data.id
    //   params.condition = {}
    //   req.model('Review').create(params)
    // })
  }
  show(req, res) {
    params.condition = {where: {id: req.params.id, createdById: req.user.id}, include: [{ all: true }]}
    return req.model('Review').findOne(params)
  }
}
