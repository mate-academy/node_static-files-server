'use strict';

const http = require('http');
const fs = require('fs');

const server = http.createServer((request, responce) => {
  const normalizedUrl = new URL(request.url, `http://${request.headers.host}`);

  if (!normalizedUrl.pathname.startsWith('/file')) {
    responce.statusCode = 404;

    responce.end('The pathname to your file should start with "/file"');
  }

  const fileName = request.url.slice(6) || 'index.html';

  try {
    const data = fs.readFileSync(`./public/${fileName}`, 'utf8');

    responce.statusCode = 200;

    responce.end(data);
  } catch (error) {
    responce.statusCode = 404;

    responce.end(`${fileName} does not exist`);
  }
});

module.exports = {
  server,
};
