const http = require('http');

function createTestServer() {
  return http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World!');
  });
}

test('responds with status 200', (done) => {
  const server = createTestServer();
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    http.get(`http://127.0.0.1:${port}`, (res) => {
      expect(res.statusCode).toBe(200);
      server.close(done);
    });
  });
});

test('responds with Hello World!', (done) => {
  const server = createTestServer();
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    http.get(`http://127.0.0.1:${port}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        expect(data).toBe('Hello World!');
        server.close(done);
      });
    });
  });
});

test('responds with Content-Type text/plain', (done) => {
  const server = createTestServer();
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    http.get(`http://127.0.0.1:${port}`, (res) => {
      expect(res.headers['content-type']).toBe('text/plain');
      server.close(done);
    });
  });
});
