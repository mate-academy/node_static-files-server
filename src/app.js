/* eslint-disable no-useless-escape */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const mineTipe = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  xml: 'text/xml',
  json: 'application/json',
  pdf: 'application/pdf',
};

const server = http.createServer((req, res) => {
  const normalizeUrl = new URL(req.url, `http://${req.headers.host}`);
  const fileNameParts = normalizeUrl.pathname.split('/').filter(arr => arr);

  if (fileNameParts[0] !== 'file') {
    res.statusCode = 412;

    res.end('The requested url is incorrect. '
      + 'The request should look like \"/file/<SEARCH_FILE>\"');

    return;
  }

  if (fileNameParts.length === 1) {
    fileNameParts[1] = 'index.html';
  }

  const fileExtension = fileNameParts[fileNameParts.length - 1].split('.');

  if (!mineTipe[fileExtension[1]]) {
    res.statusCode = 415;
    res.end('Server unsupported this file type');

    return;
  }

  try {
    const data = fs.readFileSync(
      path.join(__dirname, `../public/${fileNameParts.slice(1).join('/')}`),
      'utf8',
    );

    res.setHeader('Content-type', mineTipe[fileExtension[1]]);
    res.statusCode = 200;
    res.statusMessage = 'Ok';
    res.end(data);
  } catch (err) {
    res.statusCode = 404;
    res.end('File not found');
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
