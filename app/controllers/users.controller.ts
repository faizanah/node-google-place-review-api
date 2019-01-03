let params = {body: {}, condition: {}, pick: ['fullName', 'phone', 'avatar']}
import {uploader} from '../config/upload'
export class UsersController {
  constructor() {
  }
  list(req, res) {
    params.condition = { include: [{ all: true }] }
    return req.model('User').findAll(params)
  }
  me(req, res) {
    res.ok(req.user)
  }
  update(req, res) {
    // const storeDir = 'uploads/users/'
    // const upload = uploader(storeDir, res).single('avatar')
    // upload(req, res, function(err) {
    //   if (err) {
    //     return res.status(422).send({success: false, errors: err })
    //   }
    //   if (req.file) {
    //     req.body.avatar = req.file.location
    //   }
      params.condition = {where: {id: req.user.id}}
      return req.model('User').updateOne(params)
    // })
  }
  show(req, res) {
    params.condition = {where: {id: req.params.id}}
    req.model('User').findAll(params)
  }
  reviews(req, res) {
    params.condition = {where: {createdById: req.params.userId}, include: [ 'attachments' ]}
    req.model('Review').findAll(params)
  }
  attachments(req, res) {
    params.condition = {where: {userId: req.params.userId}}
    req.model('Attachment').findAll(params)
  }
}


