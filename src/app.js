/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const publicDir = './public';
const filePrefix = '/file/';

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (!pathName.startsWith(filePrefix)) {
    res.statusCode = 404;

    res.end(
      'To load files, use the /file/ prefix followed by the path to the file.'
    );

    return;
  }

  const fileName = pathName.substring(filePrefix.length);
  const filePath = path.join(publicDir, fileName);

  fs.readFile(filePath, (error, data) => {
    if (!error) {
      res.statusCode = 200;
      res.end(data);

      return;
    }

    res.statusCode = 404;
    res.end('File wasn\'t found');
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
