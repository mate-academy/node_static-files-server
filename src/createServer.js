'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const PREFIX = '/file';

function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    const filePath = pathname.replace(`${PREFIX}`, '') || '/index.html';

    if (pathname === PREFIX || pathname === `${PREFIX}/`) {
      res.statusMessage = `Please, use next format: http://${req.headers.host}${PREFIX}/<path_to_your_file>`;
    } else {
      res.statusMessage = 'OK';
    }

    if (pathname.includes('//')) {
      res.writeHead(404, 'traversal paths');

      res.end(
        `Please, use next format: http://${req.headers.host}${PREFIX}/<path_to_your_file>`,
      );

      return;
    }

    if (!pathname.startsWith(PREFIX)) {
      res.writeHead(400, 'Bad request');

      res.end(
        `Please, use next format: http://${req.headers.host}${PREFIX}/<path_to_your_file>`,
      );

      return;
    }

    const realPath = path.join(__dirname, '..', 'public', filePath);

    fs.readFile(realPath, (err, data) => {
      if (err) {
        res.writeHead(404, 'Not Found');
        res.end(`404 Not Found`);

        return;
      }

      res.statusCode = 200;

      res.end(data);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
