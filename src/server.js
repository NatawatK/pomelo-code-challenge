'use strict'

const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')
const axios = require('axios')

import * as algorithm from './algorithm'

// Init server
let server
if (process.env.NODE_ENV !== 'test') { // To prevent error [address already in use] when running tests
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
    var page = request.query.page || 1

    if(isNaN(page) || page < 1) return h.redirect('?page=1') //prevent some inputs may cuase an error
    if(page > 100) return h.redirect('?page=100') //prevent page exceed 100 since Github has only 100 page in searching.
    
    // Get data from GithubAPI
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

// Handle others route or unavailable url
server.route({
  method: '*',
  path: '/{any*}',
  handler: function (request, h) {
    return '404 Error! Page Not Found!'
  },
})

const init = async () => {
  await server.start()

  // Register vision for rendering views
  await server.register(require('@hapi/vision'))

  // Since I found some error when testing [can't find helper] but it works as usual when I tried with myself. I decided to register helpers manually
  const Handlebars = require('handlebars')
  Handlebars.registerHelper('link', require('./helpers/link'))
  Handlebars.registerHelper('pagination', require('./helpers/pagination'))

  server.views({
    engines: {
      html: Handlebars,
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
