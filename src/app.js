/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedUrl = new url.URL(req.url, `http://localhost;${PORT}`);
  const fileName = normalizedUrl.pathname.slice(6) || 'index.html';

  if (!normalizedUrl.pathname.startsWith('/file/')) {
    res.statusCode = 400;
    res.end('You need to start with /file/YOUR_FILE_NAME.YOUR_EXTENSION');
  }

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (!error) {
      res.statusCode = 200;
      res.end(data);
    }

    res.statusCode = 404;
    res.end('NO FILE');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
