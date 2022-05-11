'use strict';

const fs = require('fs/promises');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const { pathname } = new url.URL(req.url, `http://${req.headers.host}`);


  const splittedPath = pathname.split('/');

  console.log(splittedPath);

  if (splittedPath[1] !== 'file' && !!splittedPath[1]) {
    res.statusCode = 400;
    res.end('request must start with \'/file/\'');
  }

  fs.readFile(`./public/${splittedPath.slice(2).join('/') || 'index.html'}`)
    .then(data => {
      res.statusCode = 200;
      res.end(data);
    })
    .catch(() => {
      res.statusCode = 404;
      res.end('file is not exist');
    });
});

server.listen(3000);
