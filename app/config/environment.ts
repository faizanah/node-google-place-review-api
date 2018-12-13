require('dotenv').config()
module.exports = {
   development: {
     DATABASE_URL:  process.env.DATABASE_URL,
     secret:  process.env.SECRET,
     port: process.env.PORT || 3000,
     mailer: {
       from: process.env.MAILER_FROM,
       service: process.env.MAILER_SERVICE || 'SendGrid',
       smtp: {
         user: process.env.MAILER_USER,
         password: process.env.MAILER_PASSWORD
       }
     },
     facebookAuth: {
       clientID: process.env.FACEBOOK_APP_ID,
       clientSecret:  process.env.FACEBOOK_APP_SECRET,
     },
     aws: {
       access_key: process.env.AWS_ACCESS_KEY,
       secret_key: process.env.AWS_SECRET_KEY
     },
     host: 'http://localhost:3000'
   },
   test: {
     DATABASE_URL: 'Test DB Connection String',
     secret: 'Testing Secret',
     port: 3000
   },
   production: {
     DATABASE_URL: process.env.DATABASE_URL,
     secret: process.env.SECRET,
     port: process.env.PORT || 3000,
     host: process.env.HOST,
     mailer: {
       from: process.env.MAILER_FROM,
       service: process.env.MAILER_SERVICE || 'SendGrid',
       smtp: {
         user: process.env.MAILER_USER,
         password: process.env.MAILER_PASSWORD
       }
     },
     facebookAuth: {
       clientID: process.env.FACEBOOK_APP_ID,
       clientSecret:  process.env.FACEBOOK_APP_SECRET,
     },
     aws: {
       access_key: process.env.AWS_ACCESS_KEY,
       secret_key: process.env.AWS_SECRET_KEY
     },
   }
 }
