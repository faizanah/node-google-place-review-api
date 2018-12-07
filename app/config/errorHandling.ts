import * as _ from 'lodash'
const codesHandlingCodes = {
  'SequelizeUniqueConstraintError': 400,
  'SequelizeValidationErrorItem': 422
}

export function handleSequelizerErrors(res, err) {
  res.status(codesHandlingCodes[err.name]).send({ success: false, errors: _.map(err.errors, _.partialRight(_.pick, ['message'])) })
}
export function handleValidationErrors(res, result) {
  res.status(422).send({ success: false, errors: _.map(result.mapped(),  (err) => { return {message: err.msg} })})
}
