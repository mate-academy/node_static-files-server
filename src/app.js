'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    return;
  }

  let { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (req.url === '/file') {
    pathname += '/';
  }

  if (!pathname.startsWith('/file/')) {
    res.end('not available path, try .../file/<filename>');

    return;
  }

  res.setHeader('Content-Type', 'text/html; charset="UTF-8');

  const filepath = pathname.replace('/file/', '') || 'index.html';

  fs.readFile(`./public/${filepath}`, (error, data) => {
    if (error) {
      res.statuseCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(error));
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {});
