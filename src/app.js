/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

  const fileName = normalizedUrl.pathname.replace('/file', '').slice(1)
  || 'index.html';

  if (!normalizedUrl.pathname.startsWith('/file/')) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hint: To load files, the pathname should start with /file/');

    return;
  }

  fs.readFile(`./public/${fileName}`, (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.end('404: File Not Found!');

      return;
    }

    res.statusCode = 200;

    return res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

const options = {
  hostname: 'localhost',
  port: PORT,
  path: '/file/index.html',
  method: 'GET',
};

http.get(options, (res) => {
  res.setEncoding('utf8');
  res.on('data', console.log);
});
