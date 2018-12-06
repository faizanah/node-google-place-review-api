import {environment} from './'
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const swaggerDefinition = {
  info: {
    title: 'IMFO API',
    version: '0.0.0',
    description: 'This is the IMFO REST API',
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
    'description': 'Session operations'
  }],
  schemes: ['https', 'http'],
  consumes: ['application/json'],
  produces: ['application/json']
}
const options = {
  swaggerDefinition,
  apis: ['./docs/**/*.yaml']
}
const swaggerSpec = swaggerJSDoc(options)
const swagger = swaggerUi.serve
const swaggerDocs = swaggerUi.setup(swaggerSpec)

export { swagger, swaggerDocs };
