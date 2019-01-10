import { createToken } from '../config/auth'
import { Mailer, ENV } from '../config/'
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
      type: DataTypes.ENUM,
      values: ['pending', 'active'],
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'active']],
          msg: 'Invalid status.'
        }
      }
    },
    reviewsCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likesCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dislikesCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    photosCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    videosCount: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
      indexes: [{ unique: true, fields: ['email'] }],
      timestamps: true,
      freezeTableName: true,
      tableName: 'users'
    })

  User.associate = function(models) {
    User.hasMany(models.ReviewReport, { as: 'review_reports', foreignKey: 'userId', onDelete: 'cascade' })
    User.hasMany(models.Identity, { as: 'identities', foreignKey: 'userId', onDelete: 'cascade' })
  }

  User.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
    }
  })

  User.prototype.generateToken = function generateToken() {
    return createToken({ email: this.email, id: this.id })
  }

  User.prototype.sendResetPasswordInstructions = function sendResetPasswordInstructions() {
    const user = this
    crypto.randomBytes(20, function(err, buf) {
      user.updateAttributes({
        resetToken: buf.toString('hex'),
        resetTokenExpireAt: Date.now() + 3600000,
        resetTokenSentAt: Date.now()
      }).then(function(result) {
        const options = {
          to: result.email,
          subject: 'Reset Password Instructions ✔',
          template: 'forgot-password-email',
          context: {
            url: `${ENV.host}/password/reset/` + result.resetToken,
            user: result
          }
        }
        return mailer.send(options)
      }).catch(function(error) {
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

  User.prototype.toJSON = function() {
    let values = Object.assign({}, this.get())

    delete values.password
    delete values.resetToken
    delete values.resetTokenSentAt
    delete values.resetTokenExpireAt
    delete values.updatedAt
    return values
  }
  return User
}
