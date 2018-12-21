import {environment} from './'
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const { name, version, description } = require('../../package.json')
const fs = require('fs')
const path = require('path')
const css = fs.readFileSync(path.resolve(__dirname, '../../public/swagger-ui.css'), 'utf8')

const swaggerDefinition = {
  info: {
    title: name,
    version: version,
    description: description,
    contact: {
      name: 'VF Support',
      url: 'https://www.virtualforce.io/support',
      email: 'support@virtualforce.io'
    },
    host: environment.host,
    basePath: '/v1'
  },
  securityDefinitions: {
    'x-access-token': {
      type: 'apiKey',
      in: 'header',
      name: 'x-access-token'
    }
  },
  tags: [{
      'name': 'Session',
      'description': ''
    }, {
      'name': 'Registration',
      'description': ''
    }, {
      'name': 'User',
      'description': ''
    }],
  schemes: ['https', 'http'],
  consumes: ['application/json'],
  produces: ['application/json']
}
const options = {
  swaggerDefinition,
  apis: ['./docs/**/*.yaml']
}
const custom = {
  explorer: true,
  customCss: css,
  customSiteTitle: 'IMFO',
  customfavIcon:  '/logo.png'
}
const swaggerSpec = swaggerJSDoc(options)
const swagger = swaggerUi.serve
const swaggerDocs = swaggerUi.setup(swaggerSpec, custom)
export { swagger, swaggerDocs };
