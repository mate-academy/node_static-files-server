/* eslint-disable no-console */
'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const PORT = 8000;

const server = http.createServer((req, res) => {
  let data;

  const urlArr = req.url.split('/file');

  if (urlArr[0].length !== 0) {
    res.statusCode = 404;

    res.end('file path should start with "/file"');

    return;
  }

  const normalizedURL = new url.URL(urlArr[1], `http://${req.headers.host}`);

  const fileName = normalizedURL.pathname.slice(1)
    || 'index.html';

  try {
    data = fs.readFileSync(`./public/${fileName}`);
  } catch (err) {
    res.statusCode = 404;
    res.end();
  }

  res.end(data);
});

server.listen(PORT, (err) => {
  if (!err) {
    console.log('server is running on http://localhost:8000');
  }
});
