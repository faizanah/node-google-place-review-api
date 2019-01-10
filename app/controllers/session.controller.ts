let params = { body: {}, condition: {}, pick: {} }
import * as passport from 'passport'
export class SessionController {
  constructor() {
  }
  login(req, res) {
    req.checkBody('email', 'Enter a valid email address.').isEmail().isLength({ min: 3, max: 100 })
    req.checkBody('password', 'Password should be at least 6 chars long.').isLength({ min: 6 })
    params.condition = { where: { email: req.body.email } }
    return req.model('User').findOne(params, (data) => {
      if (data && data.authenticate(req.body.password)) {
        const token = data.generateToken()
        res.setHeader('x-access-token', token)
        return res.status(200).send({
          success: true,
          data: data,
          token: token,
          message: 'Congratulations! You have Successfully login.'
        })
      }
      else
        return res.status(401).send({
          success: false,
          errors: [{ message: 'Authentication failed. Wrong Password or email.' }]
        })
    })
  }
  facebook(req, res) {
    passport.authenticate('facebook-token', (err, auth, info) => {
      if (err) {
        if (err.oauthError) {
          const oauthError = JSON.parse(err.oauthError.data)
          res.status(422).send({ success: false, errors: [{ message: oauthError.error.message }] })
        } else
          res.status(422).send({ success: false, errors: [{ message: 'Unprocessable entity' }] })
      } else {
        params.condition = {
          where: { uid: auth.id, provider: 'facebook' },
          defaults: {
            auth: JSON.stringify(auth),
            accessToken: req.params.access_token
          }
        }
        req.model('Identity').findOrCreate(params, (data, isCreated) => {
          params.condition = { where: { id: data.userId } }
          return req.model('User').findOne(params, (data) => {
            const token = data.generateToken()
            res.setHeader('x-access-token', token)
            return res.status(200).send({
              success: true,
              data: data,
              token: token,
              message: 'Congratulations! Your account has been successfully authorized with facebook.'
            })
          })
        })
      }
    })(req, res)
  }
}
