import {environment} from './'
const passport = require('passport'),
  FacebookTokenStrategy = require('passport-facebook-token')
passport.use(new FacebookTokenStrategy({clientID: environment.facebookAuth.clientID, clientSecret: environment.facebookAuth.clientSecret},
  function(token, refreshToken, profile, done) {
    process.nextTick(function () {
      if (profile)
        return done(null, profile)
      else
        return done(null, false, { message: 'Invalid facebook access token'})
    })
  }))
