/* eslint-disable no-console */
'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 8080;

const server = http.createServer((req, res) => {
  const { url, headers } = req;
  const normalized = new URL(url, `http://${headers.host}`);
  const pathname = normalized.pathname.slice(1);
  const splitted = pathname.split('/');
  const fileName = splitted[splitted.length - 1];

  if (fileName) {
    const filePath = path.join('./public', fileName);

    fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
      if (!err) {
        res.end(data);

        return;
      }

      res.statusCode = 404;
      res.end('The specified file wasn\'t found.');
    });
  } else {
    res.end('The name of file is required. For example: /file/index.html');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
