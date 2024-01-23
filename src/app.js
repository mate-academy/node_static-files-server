/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
  const path = normalizedUrl.pathname.slice(1);
  const filePath = path.replace('file', '').slice(1) || 'index.html';

  if (!path.startsWith('file')) {
    res.statusCode = 400;
    res.end('To load files enter following path: /file/file_name');

    return;
  }

  fs.readFile(`./public/${filePath}`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
