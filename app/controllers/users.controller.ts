import { ApplicationController } from './'
export class UsersController extends ApplicationController {
  constructor() {
    super('User')
  }
  list(req, res) {
    return super._list(req, res)
  }
  me(req, res) {
    req.condition = {where: {id: req.user.id}}
    return super._findOne(req, res)
  }
}
