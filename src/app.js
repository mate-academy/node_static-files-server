'use strict';

const http = require('http');
const fs = require('fs');

const PORT = 8080;
const href = `http://localhost:${PORT}`;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  let fileName = normalizedURL.pathname
    .replace('file', '')
    .slice(1) || 'index.html';

  if (fileName === '/') {
    fileName = 'index.html';
  }

  try {
    const data = fs.readFileSync(`./public/${fileName}`, 'utf8');

    res.end(data);
  } catch (err) {
    req.statusCode = 404;
    res.end('404');
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on ${href}`);
});

const options = {
  hostname: 'localhost',
  port: PORT,
  path: '/file/',
};

http.get(options, (response) => {
  response.setEncoding('utf8');
  // eslint-disable-next-line no-console
  response.on('data', console.log);
});
