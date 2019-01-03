import * as _ from 'lodash'
import db from '../models'
import * as url from 'url'
import * as querystring from 'querystring'
export class ORM {
  constructor(
    private tableName: string,
    private req,
    private res,
    private next
  ) {
  }
  create = (options, callback = null) => {
    const self = this
    let body = self.req.body
    self.req.getValidationResult().then(function(result) {
      if (result.isEmpty()) {
        body = _.pick(_.cloneDeep(body), options.pick || [])
        return db[self.tableName].create(body, options.include || {})
          .then(data => {
            if (typeof(callback) === 'function')
              callback(data)
            else
              self.res.created(data)})
          .catch(error => {
            self.res.handleError('Sequelize', error)
          })
      } else
        self.res.handleError('Validation', result)
    })
  }

  findOrCreate = (options, callback = null) => {
    const self = this
    self.req.getValidationResult().then((result) => {
      if (result.isEmpty()) {
        return db[self.tableName].findOrCreate(options.condition || {}).spread((data, created) => {
          if (typeof(callback) === 'function')
            callback(data, created)
          else
            self.res.ok(data, {message: created ? 'Successfully Created' : 'Successfully Reterived'})
        }).catch(error =>  self.res.handleError('Sequelize', error))
      }else {
        self.res.handleError('Validation', result)
      }
    })
  }

  findOne = (options, callback = null) => {
    const self = this
    this.req.getValidationResult().then(function(result) {
      if (result.isEmpty()) {
        db[self.tableName].findOne(options.condition || {}).then(data => {
            if (typeof(callback) === 'function')
              callback(data)
            else
              self.res.ok(data)
          }
        ).catch(error => self.res.handleError('Sequelize', error))
      } else {
        self.res.handleError('Validation', result)
      }
    })
  }
  updateOne = (options, callback = null) => {
    const self = this
    let body = self.req.body
    this.req.getValidationResult().then(function (result) {
      if (result.isEmpty()) {
        body = _.pick(body, options.pick || [])
        return db[self.tableName].find(options.condition || {}).then(result => {
          return result.updateAttributes(body)
        }).then(updatedResult => {
          return this.res.ok(updatedResult, {message: 'Successfully updated'})
        }).catch(error => {
          self.res.handleError('Sequelize', error)
        })
      } else {
        self.res.handleError('Validation', result)
      }
    })
  }
  findAll = (options, callback = null) => {
    const self = this
    self.req.getValidationResult().then((result) => {
      if (result.isEmpty()) {
        let _pagination = (typeof(self.req.query['pagination']) !== 'undefined' && self.req.query['pagination'] === 'false') ? false : true
        if (_pagination) {
          let page = parseInt(self.req.query.page) || 1
          self.req.query.page = page < 0 ? 1 : page
          let limit = parseInt(self.req.query.size) || 25
          self.req.query.size = (self.req.query.size < 0 || self.req.query.size > 100) ? 25 : limit
          let offset = limit * (page - 1)
          options.condition.limit = limit
          options.condition.offset = offset
        }
        return db[self.tableName].findAndCountAll(options.condition || {}).then(data => {
          if (typeof(callback) === 'function') {
            callback(data)
          } else if (_pagination)
            self.res.status(200).send({success: true, data: data.rows, pagination: self.pagination(data),  message:  options.hasOwnProperty('message') ? options['message'] : 'List of all ' + self.tableName})
          else
            self.res.status(200).send({success: true, data: data.rows,  message:  options.hasOwnProperty('message') ? options['message'] : 'List of all ' + self.tableName})
        }).catch(error => self.res.handleError('Sequelize', error))
      } else {
        self.res.handleError('Validation', result)
      }
    })
  }

  private pagination = (data) => {
    let parsedUrl = url.parse( this.req.protocol + '://' + this.req.get('host') + this.req.originalUrl)
    const requestUrl = this.req.protocol + '://' + this.req.get('host') + parsedUrl.pathname
    let parsedQs = querystring.parse(parsedUrl.query)
    let links = {
      prev: null,
      current: parsedUrl.href,
      next: null
    }
    const page = parseInt(this.req.query.page)
    const limit = this.req.query.size
    const count =  data.count || data.length || 0
    const pages = Math.ceil(count / limit)
    const is_last = pages === page
    const is_first = 1 === page
    if (!is_first) {
      parsedQs.page =  (page - 1).toString()
      parsedQs.size =  limit
      links.prev = requestUrl + '?' + querystring.stringify(parsedQs)
    }
    if (!is_last) {
      parsedQs.page =  (page + 1).toString()
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

}
