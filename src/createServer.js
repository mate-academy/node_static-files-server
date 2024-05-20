'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');

function createServer() {
  const server = http.Server();

  server.on('request', (req, res) => {
    const nomalizedUrl = new url.URL(req.url, `http://${req.headers.host}`);

    res.setHeader('Content-type', 'text/plain');

    switch (true) {
      case req.url.includes('//'):
        res.statusCode = 404;
        res.end();

        break;

      case nomalizedUrl.pathname === '/file':
        fs.readFile(`./public/index.html`, (err, data) => {
          if (err) {
            res.statusCode = 404;
            res.end();
          }

          res.end(data);
        });

        break;

      case !nomalizedUrl.pathname.startsWith('/file/'):
        res.statusCode = 400;
        res.end('Path should begin with "/file"');

        break;

      default:
        fs.readFile(
          `./public/${nomalizedUrl.pathname.slice(6)}`,
          (err, data) => {
            if (err) {
              res.statusCode = 404;
              res.end('The file not exists');
            }

            res.end(data);
          },
        );
    }
  });

  return server;
}

module.exports = {
  createServer,
};
