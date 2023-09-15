/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const PORT = 8080;

const server = http.createServer((req, res) => {
  const normalized = new URL(req.url, `http://${req.headers.host}`);
  const path = normalized.pathname.slice(1);
  const hasSymbolsAfterSlash = /\/[^/]+$/.test(path);

  if (hasSymbolsAfterSlash) {
    const splitted = path.split('/');
    const fileName = splitted[splitted.length - 1];

    fs.readFile(`./public/${fileName}`, { encoding: 'utf8' }, (err, data) => {
      if (!err) {
        res.end(data);
      }

      res.statusCode = 404;
      res.end();
    });
  } else {
    res.end('The name of file is required. For example: /file/index.html');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
