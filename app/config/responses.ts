import * as _ from 'lodash'
let params = {tableName: ''}
const codesHandlingCodes = {
  'SequelizeUniqueConstraintError': 400,
  'SequelizeValidationErrorItem': 422,
  'SequelizeDatabaseError': 400,
  'TokenExpiredError': 401
}
export function responses(req, res, next) {
  res.handleError = function (type, err) {
    console.log('Error is: ' + JSON.stringify(err, null, 2))
    if (type === 'JwtToken')
      this.status(codesHandlingCodes[err.name] || 401).send({ success: false, errors: err})
    if (type === 'Sequelize') {
      if (err.name === 'SequelizeDatabaseError') {
        this.status(codesHandlingCodes[err.name] || 400).send({ success: false, errors: [{message: err.original.sqlMessage}]})
      } else
        this.status(codesHandlingCodes[err.name] || 400).send({ success: false, errors: _.map(err.errors, _.partialRight(_.pick, ['message'])) })
    }
    else if (type === 'Validation') {
      this.status(422).send({ success: false, errors: _.map(err.mapped(),  (error) => { return {message: error.msg} })})
    }else {
      this.status(400).send({ success: false, errors: err})
    }
  }
  res.created = function (data, options = {}) {
    if ( options && options['extra'] ) {
      Object.keys(options['extra']).forEach(function(key, value) {
        data[key] = options['extra'][key]
      })
    }
    this.status(201).send({success: true, data: data, message: options.hasOwnProperty('message') ? options['message'] : params.tableName + ' successfully created'})
  }
  res.ok = function (data, options = {}) {
    this.status(200).send({success: true, data: data, message:  options.hasOwnProperty('message') ? options['message'] : params.tableName + ' successfully retrieved'})
  }
  res.unprocessableEntity = function (message, options = {}) {
    this.status(422).send({success: false, errors: [{message: message}]})
  }
  res.notFound = function (message, options = {}) {
    this.status(404).send({success: false, errors: [{message: message}]})
  }
  next()
}
