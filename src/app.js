'use strict';

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const { url } = req;
  const correctPath = url === ('/file' || '/file/')
    ? 'public/index.html'
    : url.substring(1)
      .replace('file', 'public');

  if (!correctPath.startsWith('/file')) {
    res.end('You should start with "/file" :)');
  }

  fs.readFile(correctPath, (err, data) => {
    if (!err) {
      res.end(data);
    }

    res.statusCode(404);
    res.end('Something went wrong');
  });
});

server.listen(8080);
