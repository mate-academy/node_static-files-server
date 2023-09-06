'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.split('/')[1] !== 'file') {
    res.statusCode = 404;
    res.end('Path not found');
  } else {
    const filePath = path.join(__dirname, 'public',
      url.pathname.split('/').slice(2).join('/'));

    if (!filePath.startsWith(path.join(__dirname, 'public'))) {
      res.statusCode = 403;
      res.end('Forbidden');

      return;
    }

    const fileExtension = path.extname(filePath).slice(1);

    const mimeType = {
      html: 'text/html',
      css: 'text/css',
      js: 'text/javascript',
      jpg: 'image/jpeg',
      png: 'image/png',
      json: 'application/json',
      pdf: 'application/pdf',
    };

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('File not found');
      } else {
        res.setHeader('Content-Type', mimeType[fileExtension] || 'text/plain');
        res.end(data);
      }
    });
  }
});

server.listen(PORT, () => {
  // console.log removed
});
