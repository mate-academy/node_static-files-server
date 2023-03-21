/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const regex = /^\/file\//;

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (!regex.test(pathname)) {
    res.end('The path should start with /file/');

    return;
  }

  const fileName = pathname.replace(regex, '') || 'index.html';

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('File does not exist');

      return;
    }

    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
