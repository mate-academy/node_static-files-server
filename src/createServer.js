'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  const server = http.createServer((request, response) => {
    if (request.url.includes('/app.js')) {
      response.statusCode = 400;

      return response.end();
    }

    const normalizedUrl = new url.URL(request.url, 'http://localhost');

    const fileName = normalizedUrl.pathname;
    // "/file/styles/main.css"

    if (!fileName.startsWith('/file/')) {
      response.statusCode = 200;
      response.setHeader('content-type', 'text/plain');
      // eslint-disable-next-line no-console

      return response.end('with a hint how to load files');
    }

    if (fileName.includes('//')) {
      response.statusCode = 404;

      return response.end();
    }

    const o = fileName.replace('/file/', '');
    // styles/main.css

    fs.readFile(`./public/${o}`, (err, data) => {
      // `${HOST}/file/nonexistentfile.txt`
      if (err) {
        response.statusCode = 404;
        response.setHeader('content-type', 'text/plain');

        return response.end('File not found');
      } else {
        response.end(data);
      }
    });
  });

  return server;
}

module.exports = {
  createServer,
};
