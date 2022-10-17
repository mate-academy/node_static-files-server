'use strict';

const fs = require('fs');
const http = require('http');

const isValidPath = pathString => {
  const path = new RegExp('^/file');

  return path.test(pathString);
};

const PORT = process.env.port || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

  const validPath = isValidPath(normalizedURL.pathname);

  if (!validPath) {
    res.end("Hint: to load files you must start with a '/file/'");
  }

  const fileName = normalizedURL.pathname.replace('/file/', '')
    || 'index.html';

  fs.readFile(`./src/public/${fileName}`, (error, data) => {
    if (!error) {
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });
});

server.listen(PORT, () => {
/* eslint no-console: */
  console.log(`Server is running on http://localhost:${PORT}`);
});
