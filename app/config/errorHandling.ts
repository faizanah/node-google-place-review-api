import * as _ from 'lodash'
export class ErrorHandling {
  private codesHandlingCodes = {
    'SequelizeUniqueConstraintError': 400,
    'SequelizeValidationErrorItem': 422
  }
  constructor() {}

   sequelizer(res, err) {
    res.status(this.codesHandlingCodes[err.name]).send({ success: false, errors: _.map(err.errors, _.partialRight(_.pick, ['message'])) })
  }
  validations(res, result) {
    res.status(422).send({ success: false, errors: _.map(result.mapped(),  (err) => { return {message: err.msg} })})
  }
}
