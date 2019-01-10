'use strict'
import db from './'
module.exports = (sequelize, DataTypes) => {
  const Identity = sequelize.define('Identity', {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID
      // references: {
      //   model: 'User',
      //   key: 'id'
      // }
    },
    provider: DataTypes.STRING,
    uid: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    auth: DataTypes.TEXT
  }, {
      tableName: 'identities'
    })
  Identity.associate = function(models) {
    Identity.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
  }

  Identity.beforeCreate(function(identity, options, cb) {
    let _auth = JSON.parse(identity.auth)
    let json = _auth['_json']
    let email = json['email'] || (identity.uid + '@' + identity.provider + '.com')
    const params = {
      where: { email: email },
      defaults: {
        fullName: json.first_name + ' ' + json.last_name,
        password: '1234sadsadsabad@s;aabhdiubuqeizxcv',
        status: 'active'
      }
    }
    console.log('Before Identity params: ' + JSON.stringify(params, null, 2))
    return new Promise((resolve, reject) => {
      return db['User'].findOrCreate(params).spread((data, created) => {
        identity.userId = data.id
        resolve(identity)
      }).catch(error => reject(error))
    })
  })
  return Identity
}
