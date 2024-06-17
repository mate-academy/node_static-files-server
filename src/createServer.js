'use strict';

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');

function createServer() {
  return http.createServer((req, res) => {
    const { url } = req;

    res.setHeader('content-type', 'text/plain');

    const pathName = new URL(url, `http://${req.headers.host}`).pathname;

    // if (pathName.includes(`..`)) {
    //   res.writeHead(400, {});
    //   res.end('../ forbidden');

    //   return;
    // }

    if (url.includes('//')) {
      res.statusCode = 404;
      res.end('// forbidden');

      return;
    }

    if (!url.startsWith('/file/')) {
      res.statusCode = 200;
      res.end('/file/ missing');

      return;
    }

    const filePath = path.join(PUBLIC_DIR, url.slice(6));

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('file missing');
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  });
}

module.exports = { createServer };
