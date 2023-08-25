/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normUrl = new URL(req.url, `htt[://${req.headers.host}`);
  const fileName = normUrl.pathname.slice(6) || 'index.html';

  if (!normUrl.pathname.startsWith('/file/')) {
    res.end('Incorrect path. Valid request is: "/file/<FILE_NAME>"');
  }

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('file does not exist');
    } else {
      res.setHeader('Content-Type', 'text/plain');
      res.end(data);
    }
  });
});

server.listen(PORT, () => console.log('server started'));
