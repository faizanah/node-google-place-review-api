require('dotenv').config()
module.exports = {
   development: {
     DATABASE_URL:  process.env.DATABASE_URL,
     secret:  process.env.SECRET,
     port: 3000,
     mailer: {
       from: '"IMFO" <no-reply@imfo.com>',
       service: 'SendGrid',
       smtp: {
         user: 'Your Sendgrid Username',
         password: 'Your Sendgrid Password'
       }
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
     }
   }
 }
