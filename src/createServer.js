/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);

    const normalizedPathName =
      url.pathname.replace('/file', '') || 'index.html';

    response.setHeader('content-type', 'text/plain');

    if (!url.pathname.startsWith('/file')) {
      response.statusCode = 400;
      response.end('Your route must to start with /file/');

      return;
    }

    if (!url.pathname.startsWith('/file/')) {
      response.statusCode = 200;
      response.end('Please, try again');

      return;
    }

    if (url.pathname.includes('//')) {
      response.statusCode = 404;
      response.end('This path having two slashes - that is a trouble');

      return;
    }

    if (!fs.existsSync(`./public/${normalizedPathName}`)) {
      response.statusCode = 404;
      response.end('This file not exist');

      return;
    }

    try {
      const file = fs.readFileSync(`public${normalizedPathName}`, 'utf-8');

      response.statusCode = 200;
      response.write(file);
    } catch (err) {
      response.statusCode = 500;
      response.write('Not found');
    }
    response.end();
  });

  return server;
}

module.exports = {
  createServer,
};
