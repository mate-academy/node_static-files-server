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
  const fileName = normalizeUrl.pathname.slice(1).split('/');

  if (fileName[0] !== 'file') {
    res.statusCode = 412;

    res.end('The requested url is incorrect. '
      + 'The request should look like \"/file/<SEARCH_FILE>\"');

    return;
  }

  if (fileName.length === 1 || (fileName.length === 2 && !fileName[1])) {
    fileName[1] = 'index.html';
  }

  const typeFile = fileName[fileName.length - 1].split('.');

  if (!mineTipe[typeFile[1]]) {
    res.statusCode = 415;
    res.end('Server unsupported this file type');

    return;
  }

  try {
    const data = fs.readFileSync(
      path.join(__dirname, `../public/${fileName.slice(1).join('/')}`),
      'utf8',
    );

    res.setHeader('Content-type', mineTipe[typeFile[1]]);
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
