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


test('should fail in adding user due to no payload', async function () {
  const options = {
    method: 'POST',
    url: '/part1',
  }
  const data = await server.inject(options)
  expect(data.statusCode).toBe(400)
  expect(data.result.message).toBe('Invalid Payload')

})

test('should get proper response', async function () {
  const payload = {
    '0': [
      {
        id: 10,
        title: 'House',
        level: 0,
        children: [],
        parent_id: null,
      },
    ],
    '1': [
      {
        id: 12,
        title: 'Red Roof',
        level: 1,
        children: [],
        parent_id: 10,
      },
      {
        id: 18,
        title: 'Blue Roof',
        level: 1,
        children: [],
        parent_id: 10,
      },
      {
        id: 13,
        title: 'Wall',
        level: 1,
        children: [],
        parent_id: 10,
      },
    ],
    '2': [
      {
        id: 17,
        title: 'Blue Window',
        level: 2,
        children: [],
        parent_id: 12,
      },
      {
        id: 16,
        title: 'Door',
        level: 2,
        children: [],
        parent_id: 13,
      },
      {
        id: 15,
        title: 'Red Window',
        level: 2,
        children: [],
        parent_id: 12,
      },
    ],
  }

  const response = [
    {
      id: 10,
      title: 'House',
      level: 0,
      children: [
        {
          id: 12,
          title: 'Red Roof',
          level: 1,
          children: [
            {
              id: 17,
              title: 'Blue Window',
              level: 2,
              children: [],
              parent_id: 12,
            },
            {
              id: 15,
              title: 'Red Window',
              level: 2,
              children: [],
              parent_id: 12,
            },
          ],
          parent_id: 10,
        },
        { id: 18, title: 'Blue Roof', level: 1, children: [], parent_id: 10 },
        {
          id: 13,
          title: 'Wall',
          level: 1,
          children: [
            { id: 16, title: 'Door', level: 2, children: [], parent_id: 13 },
          ],
          parent_id: 10,
        },
      ],
      parent_id: null,
    },
  ]

  const options = {
    method: 'POST',
    url: '/part1',
    payload: payload,
  }
  const data = await server.inject(options)
  expect(data.statusCode).toBe(200)
  expect(data.result).toStrictEqual(response)
})
