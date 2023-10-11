/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-type', 'application/json');

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname !== '/favicon.ico') {
    if (!pathname.startsWith('/file')) {
      res.statusCode = 404;
      res.statusMessage = 'Bad request';

      res.end('Your path should start with /file/name_of_file');

      return;
    };

    let fileName = pathname.slice(6);

    if (pathname === '/file/' || pathname === '/file') {
      fileName = 'index.html';
    }

    fs.readFile(`./public/${fileName}`, (err, data) => {
      console.log(err);
      console.log(data);

      if (err) {
        res.statusCode = 404;
        res.statusMessage = 'File is not exist';
        res.end();
      }

      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.end(data);
    });
  }
});

server.listen(PORT, () => {
  console.log(`server running on: http://localHost:${PORT}`);
});
