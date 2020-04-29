'use strict'

const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')
const axios = require('axios')

import * as algorithm from './algorithm'

// Init server
let server
if (process.env.NODE_ENV !== 'test') {
  server = Hapi.server({
    port: 3000,
    host: 'localhost',
  })
} else server = Hapi.server()

// Homepage route
server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return 'Hello World!'
  },
})

// Part 1 route
server.route({
  method: 'POST',
  path: '/part1',
  handler: (request, h) => {
    if (request.payload) {
      return algorithm.placeChildrenInParent(request.payload)
    }
    return Boom.badRequest('Invalid Payload')
  },
})

// Part 2 route
server.route({
  method: 'GET',
  path: '/part2',
  handler: async (request, h) => {
    const page = request.query.page || 1
    const resp = await axios.get(
      `https://api.github.com/search/repositories?q=nodejs&per_page=10&page=${page}`
    )
    const repos = resp.data.items || []
    return h.view('githubRepoSearch', {
      page: page,
      repoItems: repos,
    })
  },
})

server.route({
  method: '*',
  path: '/{any*}',
  handler: function (request, h) {
    return '404 Error! Page Not Found!'
  },
})

const init = async () => {
  await server.start()

  await server.register(require('@hapi/vision'))

  server.views({
    engines: {
      html: require('handlebars'),
    },
    relativeTo: __dirname,
    path: 'templates',
    helpersPath: 'helpers',
  })

  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()

export default server
