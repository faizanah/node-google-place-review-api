import * as jwt from 'jsonwebtoken'
import unless = require('express-unless')
import { ENV } from './'
import * as winston from 'winston'
import * as express from 'express'
import db from '../models'
export function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, ENV.secret, (err, decodedToken) => {
      if (err || !decodedToken)
        return reject(err)
      resolve(decodedToken)
    })
  })
}
export function createToken(payload) {
  return jwt.sign(payload, ENV.secret, {
    expiresIn: '1y',
    algorithm: 'HS256'
  })
}
export function requiresAuth() {
  let verifyJWT_MW = (req, res, next) => {
    winston.log('info', '--> Initialisations the verifyJWT_MW')
    const token = (req.headers && req.headers['x-access-token']) ? req.headers['x-access-token'] : false
    if (token) {
      verify(token).then(decode => {
        db['User'].findOne({ where: { email: decode['email'], id: decode['id'] } }).then(user => {
          if (!user) {
            req.user = undefined
            res.handleError('JwtToken', [{ message: 'Invalid token or Expired!' }])
          } else {
            req.user = user
            next()
          }
        }).catch(function(err) {
          req.user = undefined
          next()
        })
      }).catch((err) => {
        req.user = undefined
        console.log(JSON.stringify(err, null, 2))
        res.handleError('JwtToken', err)
      })
    } else {
      req.user = undefined
      res.handleError('JwtToken', [{ message: 'Unauthorized user!' }])
    }
  }
  // verifyJWT_MW.unless = unless
  return verifyJWT_MW
}

