/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const CORRECT_FOLDER = 'file';
const ERROR = {
  FILE_NOT_EXIST: 'Can not read this file!',
  WRONG_PATHNAME: `The pathname must start with '/file'`,
};

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  const correctURL = normalizedURL.pathname.slice(1);
  const arrayOfPathname = correctURL.split('/');

  const folder = arrayOfPathname[0];
  const secondPath = arrayOfPathname.length >= 2 ? arrayOfPathname[1] : '';
  const fileName = secondPath.length
    ? normalizedURL.pathname.replace('/file', '')
    : 'index.html';

  if (folder === CORRECT_FOLDER) {
    fs.readFile(`./public/${fileName}`, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end(ERROR.FILE_NOT_EXIST);
      } else {
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end(ERROR.WRONG_PATHNAME);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
