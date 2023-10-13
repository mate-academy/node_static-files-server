/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

  if (normalizedURL.pathname.startsWith('/file')) {
    const fileName = (normalizedURL.pathname === '/file'
    || normalizedURL.pathname === '/file/')
      ? 'index.html'
      : normalizedURL.pathname.replace('/file/', '');

    fs.readFile(`./public/${fileName}`, (error, data) => {
      if (error) {
        res.statusCode = 404;
        res.end('File not found.');
      }

      res.statusCode = 200;
      res.end(data);
    });
  } else {
    res.statusCode = 404;
    res.end('Hint: To load files, use URLs starting with "/file/".');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
