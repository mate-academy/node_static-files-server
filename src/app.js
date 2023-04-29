'use strict';

const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/file/')) {
    let pathToFile = req.url.slice(6);

    if (!pathToFile) {
      pathToFile = 'index.html';
    }

    fs.readFile(`public/${pathToFile}`, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('File not found');
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('To load files, use /file/ followed by the file path');
  }
});

server.listen(8080, () => {
  // eslint-disable-next-line no-console
  console.log('Server Start');
});
