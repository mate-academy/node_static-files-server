'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const FILE_PATH = '/file';
const PUBLIC_PATH = '/public';

function createServer() {
  const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-Type', 'text/plain');

    if (!pathname.includes(FILE_PATH)) {
      res.statusCode = 400;
      res.end('Hint: for load file `pathname` must start with `/file/`');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Double "//" not supported.');

      return;
    }

    let publicPath = pathname.replace(FILE_PATH, PUBLIC_PATH);

    if (publicPath === PUBLIC_PATH || publicPath === `${PUBLIC_PATH}/`) {
      publicPath = path.join(publicPath, 'index.html');
    }

    fs.readFile(`.${publicPath}`, (error, data) => {
      if (error) {
        res.statusCode = 404;
        res.end(`${publicPath} not found.`);

        return;
      };
      res.statusCode = 200;
      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
