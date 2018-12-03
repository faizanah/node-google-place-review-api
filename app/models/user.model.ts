import {createJWToken} from '../config/auth'
import { Mailer, environment } from '../config/'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
const mailer = new Mailer()
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    fullName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: [6, 100]
      }
    },
    resetToken: {
      type: DataTypes.STRING
    },
    resetTokenSentAt: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    },
    resetTokenExpireAt: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 128],
          msg: 'Email address must be between 6 and 128 characters in length'
        },
        isEmail: {
          msg: 'Email address must be valid'
        }
      }
    },
      status: {
        allowNull: false,
        type:   DataTypes.ENUM,
        values: ['pending' , 'accepted'],
        defaultValue: 'pending',
        validate: {
          isIn: {
            args: [['pending' , 'accepted']],
            msg: 'Invalid status.'
          }
        }
      }
  }, {
    indexes: [{unique: true, fields: ['email']}],
    timestamps: true,
    freezeTableName: true,
    tableName: 'users'
  })

  User.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
    }
  })

  User.prototype.generateToken = function generateToken() {
    return createJWToken({ email: this.email, id: this.id})
  }

  User.prototype.sendResetPasswordInstructions = function sendResetPasswordInstructions() {
    const user = this
    crypto.randomBytes(20, function (err, buf) {
      user.updateAttributes({
        resetToken: buf.toString('hex'),
        resetTokenExpireAt: Date.now() + 3600000,
        resetTokenSentAt: Date.now()
      }).then(function (result) {
        console.log('Password: ' + JSON.stringify(result, null, 2))
        const options = {
          to: result.email,
          subject: 'Reset Password Instructions ✔',
          template: 'forgot-password-email',
          context: {
            url: `${environment.host}/password/reset/` + result.resetToken,
            user: result
          }
        }
        // const options = {
        //   to: result.email,
        //   subject: 'Reset Password Instructions ✔',
        //   text: 'Please click on the link to reset your password ',
        //   html: '<b>You are receiving this because you (or someone else) have requested the reset of the password for your account.' +
        //   'Please click on the following link </b>' +
        //   '<a href=http://localhost:3000/passwords/reset/' + result.resetToken + '> Click me!. </a>' +
        //   'If you did not request this, please ignore this email and your password will remain unchanged.'
        // }
        return mailer.send(options)
      }).catch(function (error) {
        console.log(JSON.stringify(error, null, 2))
      })
    })
  }

  User.prototype.authenticate = function authenticate(value) {
    if (bcrypt.compareSync(value, this.password))
      return this
    else
      return false
  }
  return User
}
