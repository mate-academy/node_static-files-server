/* eslint-disable max-len */
'use strict';

const fs = require('fs');
const http = require('http');
const url = require('url');

const PORT = 4000;

const server = http.createServer((request, response) => {
  const normalizeUrl = new url.Url(request.url, `http://${request.headers.host}`);

  if (!normalizeUrl.pathname.startsWith('/file')) {
    response.end('The path is not exist. Try again. Example: /file/index.html');
  }

  const fileName = normalizeUrl.pathname.replace(/\/file\//g, '') || 'index.html';

  fs.readFile(`/public${fileName}`, (error, data) => {
    if (!error) {
      response.end(data);
    }

    response.statusCode = 404;
  });
});

server.listen(PORT);

module.exports = { server };
