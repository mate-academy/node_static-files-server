'use strict';

const http = require('http');
const fs = require('fs');

function createServer() {
  return http.createServer((req, res) => {
    const protocol = req.socket.encrypted ? 'https' : 'http';
    const hostName = `${protocol}://${req.headers.host}${req.url}`;
    const parsedUrl = new URL(hostName);

    res.setHeader('Content-Type', 'text/plain');

    if (!parsedUrl.pathname.startsWith('/file')) {
      res.statusCode = 400;
      res.end('Wrong address');

      return;
    }

    if (parsedUrl.pathname.includes('//')) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    const fileName =
      parsedUrl.pathname.replace('/file', '').slice(1) || 'index.html';

    // eslint-disable-next-line handle-callback-err
    fs.readFile(`./public/${fileName}`, (err, data) => {
      if (!err) {
        res.end(data);

        return;
      }

      res.statusCode = 404;
      res.end('File not found');
    });
  });
}

module.exports = {
  createServer,
};
