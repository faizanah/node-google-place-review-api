import { ENV } from './'
import * as passport from 'passport'
const FacebookTokenStrategy = require('passport-facebook-token')
passport.use(new FacebookTokenStrategy({ clientID: ENV.facebookAuth.clientID, clientSecret: ENV.facebookAuth.clientSecret, profileFields: ['name', 'email'] },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (profile)
        return done(null, profile)
      else
        return done(null, false, { message: 'Invalid facebook access token' })
    })
  }))
