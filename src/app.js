/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 8080;

const server = http.createServer((request, response) => {
  const normalizeUrl = new url.URL(
    request.url,
    `http://${request.headers.host}`,
  );

  if (!(normalizeUrl.pathname.startsWith('/file'))) {
    response.end('Path to file should begin from /file/');
  }

  const fileName = normalizeUrl.pathname.replace('/file', '')
    || 'index.html';

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (!error) {
      response.end(data);
    }

    response.statusCode = 404;
    response.end();
  });

  response.end();
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
