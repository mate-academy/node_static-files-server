'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizedURL = new url.URL(req.url, `http://${req.headers.host}`);
  const { pathname } = normalizedURL;

  if (!pathname.startsWith('/file')) {
    res.end('The path should start with /file/');
    return;
  };

  const removeFile = pathname.replace('/file', '');
  console.log(removeFile, '>>>');
  const returnFile = removeFile.startsWith('/')
    ? removeFile.slice(1)
    : removeFile;

  const filename = returnFile || 'index.html';

  fs.readFile(`./public/${filename}`, (err, data) => {
    if (err) {
      res.statusCode = 404;
      req.statusMessage = 'The requestis invalid';
      res.end('The requested file does not exist');
      return;
    }

    res.statusCode = 200;
    res.statusMessage = 'OK';

    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
