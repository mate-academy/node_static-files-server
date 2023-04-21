'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
    const path = normalizedUrl.pathname.slice(1);
    const pathArr = path.split('/');

    if (pathArr.length < 1 || pathArr.shift() !== 'file') {
      res.statusCode = 400;
      res.statusText = 'Bad request';

      res.end(JSON.stringify({
        message: 'path to file should start with /file/ folder',
      }));

      return;
    }

    if (!pathArr.length || (pathArr.length === 1 && !pathArr[0])) {
      pathArr.push('index.html');
    }

    if (!fs.existsSync(`./public/${pathArr.join('/')}`)) {
      res.statusCode = 404;
      res.statusText = 'File not found';

      res.end(JSON.stringify({
        message: 'File not found',
      }));

      return;
    }

    fs.readFile(`./public/${pathArr.join('/')}`, (error, data) => {
      if (error) {
        res.statusCode = 400;
        res.statusText = 'Bad request';

        res.end(JSON.stringify({
          error,
        }));

        return;
      }

      res.end(data);
    });
  });
}

module.exports = { createServer };
