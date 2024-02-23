'use strict';

const http = require('node:http');
const fs = require('node:fs');

/* eslint no-console: "warn" */
/* eslint no-useless-escape: "warn" */

function createServer() {
  const server = http.createServer((req, res) => {
    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
    const routeFile = '/file';
    const hints = {
      wrongFileEndPoint: 'Pathname must start with `/file/`',
      wrongFormat: `pathname must be http://${req.headers.host}/file/fileName`,
      noFile: 'No such file',
    };

    if (!normalizedUrl.pathname.startsWith(routeFile)) {
      res.statusCode = 400;
      res.end(hints.wrongFileEndPoint);

      return;
    }

    if (normalizedUrl.pathname.includes('//')) {
      res.statusCode = 404;
      res.end(hints.wrongFormat);

      return;
    }

    const pathToFile
      = normalizedUrl.pathname.slice(routeFile.length);

    res.setHeader('content-type', 'text/plain');

    if (pathToFile) {
      fs.readFile(
        `./public/${pathToFile}`,
        (err, data) => {
          if (err) {
            res.statusCode = 404;
            res.end(hints.noFile);

            return;
          }

          res.statusCode = 200;
          res.end(data);
        });
    } else {
      res.statusCode = 200;
      res.end(hints.wrongFormat);
    }
  });

  return server;
}

module.exports = {
  createServer,
};
