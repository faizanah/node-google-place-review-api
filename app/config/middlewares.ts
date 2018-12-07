import {verifyJWTToken} from './auth'
import db from '../models/'
import {environment} from './'
export function verifyJWT_MW(req, res, next) {
  req.env = environment
  if (req.headers && req.headers['x-access-token']) {
    verifyJWTToken(req.headers['x-access-token']).then(decode => {
      console.log('Decode Token:' + JSON.stringify(decode, null, 2))
      db['User'].findOne({where: {email: decode['email'], id: decode['id']}}).then(function (user) {
          if (!user) {
            req.user = undefined
            return res.status(401).json({ success: false, errors: [{message: 'Invalid token or Expired!'}] })
          } else {
            req.user = user
            next()
          }
        }).catch(function (err) {
          req.user = undefined
          next()
        })
    }).catch((err) => {
      return res.status(400).json({ success: false, errors: [{message: 'Invalid auth token provided.'}] })
    })
  }else {
    req.user = undefined
    return res.status(401).json({ success: false, errors: [{message: 'Unauthorized user!'}] })
  }

}
