/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

  const pureFile = normalizedURL.pathname.slice(6) || 'index.html';

  if (!normalizedURL.pathname.startsWith('/file/')) {
    res.statusCode = 404;

    res.end(
      'Please, use /file/ for the correct file path.'
    );
  }

  if (fs.existsSync(`./public/${pureFile}`)) {
    res.statusCode = 200;

    const data = fs.readFileSync(`./public/${pureFile}`, 'utf8');

    res.end(data);
  } else {
    res.statusCode = 404;

    res.end('File not found');
  }

  return server;
});
