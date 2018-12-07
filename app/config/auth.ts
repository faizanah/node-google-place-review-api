import * as jwt from 'jsonwebtoken'
import {environment} from './'
export function verifyJWTToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, environment.secret, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err)
      }
      resolve(decodedToken)
    })
  })
}

export function createJWToken(payload) {
  return jwt.sign(payload, environment.secret, {
    expiresIn: 3600,
    algorithm: 'HS256'
  })
}
