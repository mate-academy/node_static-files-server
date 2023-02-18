'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  const normalizedURL = new URL(request.url, `http://${request.headers.host}`);
  let fileName = '';

  if (normalizedURL.pathname.startsWith('/file')) {
    fileName = normalizedURL.pathname.replace('/file/', '');
  } else {
    response.end('Please send correct request with "/file/<FILE_NAME>" format');
  }

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (error) {
      response.statusCode = 404;
      response.end();
    } else {
      response.end(data);
    }
  });
});

server.listen(PORT);
