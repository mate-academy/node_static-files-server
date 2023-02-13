/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const clearUrl = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = clearUrl;

  const pathArr = pathname.split('/').filter((item) => item !== '');

  if (pathArr[0] === 'file') {
    const path = pathArr.splice(1).join('/') || 'index.html';

    fs.readFile(`./public/${path}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end('404 Not Found');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Please, use /file/');
  }
});

server.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
