/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  const normalizedUrl = new URL(
    request.url,
    `http://${request.headers.host}`
  );

  const isFilePath = normalizedUrl.pathname
    .slice(1)
    .split('/')[0] === 'file';

  const fileName = isFilePath
    ? normalizedUrl.pathname
      .split('/')
      .slice(2)
      .join('/')
    : normalizedUrl.pathname
      .slice(1);

  fs.readFile(`./src/public/${fileName}`, (error, data) => {
    if (!error && isFilePath) {
      response.statusCode = 200;
      response.end(data);

      return;
    } else if (!error && !isFilePath) {
      response.statusCode = 404;
      response.end('Maybe you dont used "/file/" before your requested file');

      return;
    }

    response.statusCode = 404;

    response.end('oops, file not found');
  });
});

server.listen(PORT, () => {
  console.log('Server is running');
});
