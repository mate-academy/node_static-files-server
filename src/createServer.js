/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');

function createServer() {
  return http.createServer((req, res) => {
    const myUrl = new url.URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-type', 'text/plain');
    console.log(myUrl);

    const hints = {
      wrongFileEndPoint: 'Pathname must start with `/file/`',
      wrongFormat: `pathname must be http://${req.headers.host}/file/fileName`,
      noFile: 'No such file',
    };

    if (myUrl.pathname.includes('//')) {
      res.statusCode = 404;

      res.end(hints.wrongFormat);

      return;
    }

    if (myUrl.pathname === '/file') {
      res.statusCode = 200;

      res.end(hints.wrongFileEndPoint);

      return;
    }

    if (!myUrl.pathname.startsWith('/file/')) {
      res.statusCode = 400;

      res.end(hints.wrongFormat);

      return;
    }

    const pathname = myUrl.pathname.replace('/file/', '') || 'index.html';

    fs.readFile(`./public/${pathname}`, (err, data) => {
      if (!err) {
        res.statusCode = 200;
        res.end(data);

        return;
      }

      res.statusCode = 404;
      res.end(hints.noFile);
    });
  });
}

module.exports = {
  createServer,
};
