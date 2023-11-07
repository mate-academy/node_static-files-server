/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response) => {
  if (!request.url.startsWith('/file/')) {
    response.end('Path must start from "/file/"');
  }

  const fileName = request.url.replace('/file/', '') || 'index.html';

  fs.readFile(`public/${fileName}`, (error, data) => {
    if (!error) {
      response.end(data);
    }

    response.statusCode = 404;
    response.end();
  });
});

server.listen(3007, () => {
  console.log(`Server is running on http://localhost:3007`);
});
