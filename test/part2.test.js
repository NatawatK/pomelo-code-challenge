import server from '../src/server' // Import Server/Application

// Start application before running the test case
beforeAll((done) => {
  server.events.on('start', () => {
    done()
  })
})

// Stop application after running the test case
afterAll((done) => {
  server.events.on('stop', () => {
    done()
  })
  server.stop()
})


test('should return page1 if there are no query params(page)', async function () {
  const options = {
    method: 'GET',
    url: '/part2',
  }
  const data = await server.inject(options)
  expect(data.statusCode).toBe(200)
})

test('should redirect to page1 if input page is less than 1', async function () {
    const options = {
      method: 'GET',
      url: '/part2?page=-123',
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(302)
    expect(data.headers.location).toBe('?page=1')

  })

  test('should redirect to page100 if input page is more than 100', async function () {
    const options = {
      method: 'GET',
      url: '/part2?page=12345',
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(302)
    expect(data.headers.location).toBe('?page=100')
  })
