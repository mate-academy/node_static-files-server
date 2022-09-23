/* eslint-disable no-console */
'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const normalizeURL = new url.URL(req.url, `http://${req.headers.host}`);
  const currPath = '/file/';
  const hasCurrPath = normalizeURL.pathname.startsWith(currPath);

  const fileName
    = (hasCurrPath
      ? normalizeURL.pathname.slice(6)
      : normalizeURL.pathname.slice(1)
    )
      || 'index.html';

  fs.readFile(`./public/${fileName}`, (err, data) => {
    if (err) {
      res.statusCode = 404;

      if (!hasCurrPath) {
        res.end('to download data please put /file/ before filename');
      }

      res.end();
    } else {
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
