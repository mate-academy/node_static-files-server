/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let fileName = req.url.replace(/\/\.\.\//g, '/');

  console.log(fileName);

  if (fileName.slice(0, 5) !== '/file') {
    res.writeHead(404, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify({
      'res': 'Your request should start with /file',
    }));

    return;
  }

  fileName = fileName.slice(5);

  if (fileName === ''
    || fileName === '/'
    || fileName === '/index'
    || fileName === '/index.html') {
    fileName = 'index.html';
  }

  const filePath = path.join(__dirname, '/../public', fileName);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (!err) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync(path.join(__dirname, '/../public/src/404.html')));
    }
  });
});

server.listen(3000, () => {
  console.log(`server is running at http://localhost:3000`);
});
