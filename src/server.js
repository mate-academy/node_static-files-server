/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  if (req.url.slice(1).split('/')[0] === 'file') {
    const normilizedURL = new URL(req.url, `http://${req.headers.host}`);

    console.log(req.url);

    const fileName = normilizedURL.pathname
      .split('/').slice(2).join('/') || 'index.html';

    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end();
      } else {
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
