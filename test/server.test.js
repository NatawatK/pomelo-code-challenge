import server from '../src/server' // Import Server/Application

// Start application before running the test case
beforeAll((done) => {
    server.events.on('start', () => {
        done();
    });
});

// Stop application after running the test case
afterAll((done) => {
    server.events.on('stop', () => {
        done();
    });
    server.stop();
});

test('should success with server connection', async function () {
    const options = {
        method: 'GET',
        url: '/'
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
});

test('should get 404 not found in visiting random page', async () => {
    const options = {
        method: 'GET',
        url: '/random-page'
    };
    const data = await server.inject(options);
    expect(data.statusCode).toBe(200);
    expect(data.result).toBe('404 Error! Page Not Found!')
})