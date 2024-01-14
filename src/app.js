'use strict';

const http = require('http');
const fs = require('fs');
const PORT = 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://localhost:${PORT}`);
  const parts = normalizedURL.pathname;

  if (!parts.includes('favicon.ico')) {
    if (!parts.startsWith('/file/')) {
      res.end('Error. Path must begin with "/file/"');
    }

    const path = (parts === '/file/' || parts === '/file')
      ? '/index.html'
      : parts.slice(5);

    fs.readFile(`public${path}`, (err, data) => {
      if (!err) {
        res.end(data);
      } else {
        res.statusCode = 404;
        res.end('Error 404: no such file or directory');
      }
    });
  };
});

server.listen(PORT);
