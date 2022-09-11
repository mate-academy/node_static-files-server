'use strict';

/* eslint-disable no-console */
const http = require('http');
const fs = require('fs');
const PORT = 8080;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let parts = url.pathname.slice(1).split('/');
  const firstPart = parts[0];

  if (parts[0] === 'file') {
    parts[0] = 'public';
    parts = parts.join('/');
  } else {
    parts[0] = '';
    parts = parts.join('/');
  }

  fs.readFile(`./src/${parts}`, 'utf8', (err, data) => {
    if (!err) {
      console.log(data);
      res.end(data);
    } else {
      res.statusCode = 404;

      firstPart !== 'file'
        ? console.log('Pathname must start with /file/')
        : res.end();
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at port http://localhost:${PORT}`);
});
