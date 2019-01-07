import * as hbs from 'nodemailer-express-handlebars'
import * as nodemailer from 'nodemailer'
import * as path from 'path'
import { ENV } from './'
class Mailer {
  constructor() {
  }

  send = (mailOptions) => {
    mailOptions.from = mailOptions.from || ENV.mailer.from
    this.transporter().sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        return false
      }
      console.log('Message sent: %s', info.messageId)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      return true
    })
  }

  transporter = () => {
    const smtpTransport = nodemailer.createTransport(this.getConnection())
    const handlebarsOptions = {
      viewEngine: 'handlebars',
      viewPath: path.resolve('./views/mailer/'),
      extName: '.html'
    }
    smtpTransport.use('compile', hbs(handlebarsOptions))
    return smtpTransport
  }
  getConnection = () => {
    return {
      service: ENV.mailer.service,
      auth: {
        user: ENV.mailer.smtp.user,
        pass: ENV.mailer.smtp.password
      }
    }
  }
}
export default Mailer
