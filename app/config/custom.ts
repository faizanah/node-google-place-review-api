import db from '../models/'
import {environment} from './'
import * as _ from 'lodash'
const codesHandlingCodes = {
  'SequelizeUniqueConstraintError': 400,
  'SequelizeValidationErrorItem': 422
}
export function custom(req, res, next) {
  req.db = db
  res.handleError = function (type, err) {
    console.log('Error is: ' + JSON.stringify(err, null, 2))
    if (type === 'Sequelize')
      this.status(codesHandlingCodes[err.name] || 400).send({ success: false, errors: _.map(err.errors, _.partialRight(_.pick, ['message'])) })
    else if (type === 'Validation') {
      this.status(422).send({ success: false, errors: _.map(err.mapped(),  (error) => { return {message: error.msg} })})
    }else {
      this.status(400).send({ success: false, errors: err})
    }
  }
  res.created = function (data, options) {
    this.status(201).send({success: true, data: data, message: 'Successfully Created'})
  }
  res.ok = function (data, options) {
    this.status(200).send({success: true, data: data, message:  'Successfully Reterived'})
  }
}
