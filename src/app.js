/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const clearUrl = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = clearUrl;

  if (!pathname.startsWith('/file')) {
    res.statusCode = 404;
    res.end('Please, use /file/');
  }

  const pathArr = pathname
    .split('/')
    .filter((item) => item !== '' && item !== 'file');

  const path = pathArr.splice(1).join('/') || 'index.html';

  fs.readFile(`./public/${path}`, (err, data) => {
    if (!err) {
      res.statusCode = 200;
      res.end(data);

      /*
      * if I don't return here,
      * I receive an 'ERR_STREAM_WRITE_AFTER_END' error
      * so I either have to return here or add an else statement
      * like I did previously
      ? if there is a better way to do this, please let me know
      */

      return;
    }
    res.statusCode = 404;
    res.end('404 Not Found');
  });
});

server.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
