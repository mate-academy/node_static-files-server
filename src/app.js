'use strict';

const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  let fileName = req.url.slice(1);

  if (fileName.slice(0, 4) !== 'file') {
    res.statusCode = 404;
    res.end('Your requst shoud contain /file/...');
  }

  fileName = fileName.slice(5) || 'index.html';

  fs.readFile(`src/public/${fileName}`, 'utf8', (error, data) => {
    if (!error) {
      res.statusCode = 200;
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });
});
