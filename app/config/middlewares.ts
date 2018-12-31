import {verifyJWTToken} from './auth'
import * as winston from 'winston'
import db from '../models/'
import {environment} from './'
import * as _ from 'lodash'
import * as url from 'url'
const querystring = require('querystring')
let params = {tableName: ''}
const codesHandlingCodes = {
  'SequelizeUniqueConstraintError': 400,
  'SequelizeValidationErrorItem': 422,
  'SequelizeDatabaseError': 400,
  'TokenExpiredError': 401
}
export function activerecord(req, res, next) {
  req.env = environment
  req.db = db
  req.model = function (model: string) {
    params.tableName = model
    return this
  }
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
      console.log(options['extra'])
      Object.keys(options['extra']).forEach(function(key, value) {
        console.log(key + ': ' + options['extra'][key])
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
  req.findOne = function(options, callback = null){
    this.getValidationResult().then(function(result) {
      if (result.isEmpty()) {
        db[params.tableName].findOne(options.condition || {}).then(data => {
            if (typeof(callback) === 'function')
              callback(data)
            else
              res.ok(data)
          }
        ).catch(error => res.handleError('Sequelize', error))
      } else {
        res.handleError('Validation', result)
      }
    })
  }
  req.findOrCreate = function(options, callback = null){
    this.getValidationResult().then((result) => {
      if (result.isEmpty()) {
        return db[params.tableName].findOrCreate(options.condition || {}).spread((data, created) => {
          if (typeof(callback) === 'function')
            callback(data, created)
          else
            res.ok(data, {message: created ? 'Successfully Created' : 'Successfully Reterived'})
        }).catch(error =>  res.handleError('Sequelize', error))
      }else {
        res.handleError('Validation', result)
      }
    })
  }
  req.findAll = function(options, callback = null){
    const self = this
    this.getValidationResult().then((result) => {
      if (result.isEmpty()) {
        let _pagination = (typeof(self.query['pagination']) !== 'undefined' && self.query['pagination'] === 'false') ? false : true
        if (_pagination) {
          let page = parseInt(self.query.page) || 1
          self.query.page = page < 0 ? 1 : page
          let limit = parseInt(self.query.size) || 25
          self.query.size = (self.query.size < 0 || self.query.size > 100) ? 25 : limit
          let offset = limit * (page - 1)
          options.condition.limit = limit
          options.condition.offset = offset
          // if (typeof(options.condition['order']) !== 'undefined')
          //   options.condition.order.push(['createdAt', 'ASC'])
          // else
          //   options.condition.order = [['createdAt', 'ASC']]
        }
        return db[params.tableName].findAndCountAll(options.condition || {}).then(data => {
          // res.ok(data, {message: 'List of all ' + params.tableName})
          if (typeof(callback) === 'function') {
            callback(data)
          } else if (_pagination)
            res.status(200).send({success: true, data: data.rows, pagination: pagination(data , self),  message:  options.hasOwnProperty('message') ? options['message'] : 'List of all ' + params.tableName})
          else
            res.status(200).send({success: true, data: data.rows,  message:  options.hasOwnProperty('message') ? options['message'] : 'List of all ' + params.tableName})
        }).catch(error => res.handleError('Sequelize', error))
      } else {
        res.handleError('Validation', result)
      }
    })
  }
  req.create = function(options, callback = null){
    console.log(JSON.stringify(this.body, null, 2))
    console.log('Options is: ' + JSON.stringify(options, null, 2))
    let body = this.body
    this.getValidationResult().then(function(result) {
      if (result.isEmpty()) {
        body = _.pick(_.cloneDeep(body), options.pick || [])
        return db[params.tableName].create(body, options.condition || {})
          .then(data => {
            if (typeof(callback) === 'function')
              callback(data)
            else
              res.created(data)})
          .catch(error => {
            res.handleError('Sequelize', error)
          })
      } else
        res.handleError('Validation', result)
    })
  }
  req.updateOne = function(options, callback = null) {
    let body = this.body
    this.getValidationResult().then(function (result) {
      if (result.isEmpty()) {
        body = _.pick(body, options.pick || [])
        return db[params.tableName].find(options.condition || {}).then(result => {
            return result.updateAttributes(body)
          }).then(updatedResult => {
            return res.ok(updatedResult, {message: 'Successfully updated'})
          }).catch(error => {
            res.handleError('Sequelize', error)
          })
      } else {
        res.handleError('Validation', result)
      }
    })
  }
  next()
}
function pagination(data , req) {
  let parsedUrl = url.parse( req.protocol + '://' + req.get('host') + req.originalUrl)
  const requestUrl = req.protocol + '://' + req.get('host') + parsedUrl.pathname
  let parsedQs = querystring.parse(parsedUrl.query)
  let links = {
    prev: null,
    current: parsedUrl.href,
    next: null
  }
  const page = req.query.page
  const limit = req.query.size
  const count =  data.count || data.length || 0
  const pages = Math.ceil(count / limit)
  const is_last = pages === page
  const is_first = 1 === page
  if (!is_first) {
    parsedQs.page =  page - 1
    parsedQs.size =  limit
    links.prev = requestUrl + '?' + querystring.stringify(parsedQs)
  }
  if (!is_last) {
    parsedQs.page =  page + 1
    parsedQs.size =  limit
    links.next = requestUrl + '?' + querystring.stringify(parsedQs)
  }
  return {
    total: count,
    pages: pages,
    perPage: limit,
    current: page,
    next: (is_last ? null : page + 1),
    prev: (is_first ? null : page - 1),
    isFirst: is_first,
    isLast: is_last,
    links: links
  }
}
export function verifyJWT_MW(req, res, next) {
  winston.log('info', '--> Initialisations the verifyJWT_MW')
  if (req.headers && req.headers['x-access-token']) {
    verifyJWTToken(req.headers['x-access-token']).then(decode => {
      db['User'].findOne({where: {email: decode['email'], id: decode['id']}}).then(function (user) {
          if (!user) {
            req.user = undefined
            res.handleError('JwtToken', [{message: 'Invalid token or Expired!'}])
          } else {
            req.user = user
            next()
          }
        }).catch(function (err) {
          req.user = undefined
          next()
        })
    }).catch((err) => {
      req.user = undefined
      console.log(JSON.stringify(err, null, 2))
      res.handleError('JwtToken', err)
    })
  }else {
    req.user = undefined
    res.handleError('JwtToken', [{message: 'Unauthorized user!'}])
  }
}
