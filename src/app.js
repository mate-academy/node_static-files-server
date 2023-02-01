/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

  if (!normalizedURL.pathname.startsWith('/file')) {
    res.end('To load files you need to make request like /file/FILE_NAME');
  }

  const fileName = normalizedURL.pathname.split('/').slice(2).join('/')
    || 'index.html';

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (!error) {
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
