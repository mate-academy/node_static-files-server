'use strict';

const fs = require('fs');
const http = require('http');

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    if (req.url?.includes('//')) {
      res.writeHead(404, 'Not Found');
      res.end('Not Found');

      return;
    }

    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const path = url.pathname.slice(1);

    let filePath = './public/index.html';

    if (!path.startsWith('file')) {
      res.writeHead(400, 'Bad Request');
      res.end('Bad Request');

      return;
    }

    if (path !== 'file' && path !== 'file/') {
      filePath = `./public/${path.split('/').slice(1).join('/')}`;
    }

    // eslint-disable-next-line no-console
    console.log(filePath);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (!err) {
        res.writeHead(200);
        res.end(data);

        return;
      }

      res.writeHead(404, 'Not Found');
      res.end('Not Found');
    });
  });
}

module.exports = {
  createServer,
};
