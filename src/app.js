/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizeURL = new URL(req.url, `http://${req.headers.host}`);
  const fileName = normalizeURL.pathname.slice(6) || 'index.html';

  if (!normalizeURL.pathname.startsWith('/file/')) {
    res.statusCode = 404;

    res.end(
      'To load files, use the /file/ prefix followed by the path to the file.'
    );
  }

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (!error) {
      res.statusCode = 200;
      res.end(data);
    }

    res.statusCode = 404;
    res.end('File doesn\'t exist');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
