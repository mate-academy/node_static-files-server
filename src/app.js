/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizeUrl = new URL(req.url, 'http://' + req.headers.host);
  const parts = normalizeUrl.pathname.split('/').filter(str => str !== '');

  if (parts.length && parts[0] !== 'file') {
    res.statusCode = 404;
    res.statusMessage = 'wrong url request';

    res.end(
      'url must be like: \'/file/index.html\', require start only with \'file\''
    );
  } else {
    const fileName = parts.slice(1).join('/');

    fs.readFile(`./public/${fileName}`, (error, data) => {
      if (error) {
        res.statusCode = 404;
        res.statusMessage = 'file was not found';

        res.end(
          'this file does not exist'
        );
      } else {
        res.end(data);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log('server is running http://localhost:' + PORT);
});
