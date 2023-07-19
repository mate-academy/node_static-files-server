'use strict';

const fs = require('fs');
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const formattedUrl = new url.URL(req.url, `http://${req.headers.host}`);

  if (formattedUrl.pathname.split('/')[1] !== 'file') {
    res.statusCode = 404;
    res.end('use path starting with /file/ like /file/index.html');
  }

  const fileName
    = formattedUrl.pathname.split('/').slice(2).join('/') || 'index.html';

  fs.readFile(`src/public/${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('use path starting with /file/ like /file/index.html');
    } else {
      res.end(data);
    }
  });
});

server.listen(3000, () => {
  // eslint-disable-next-line
  console.log('server running...');
});

module.exports = { server };
