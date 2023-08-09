/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');

const staticFiles = () => {
  const server = http.createServer((req, res) => {
    if (req.url.slice(1) === 'favicon.ico') {
      return;
    }

    if (!req.url.includes('file')) {
      res.end('<h4>Start request with "/file.."</h4>');
      res.statusCode = 400;
      res.statusMessage = 'Bad request';

      return;
    }

    try {
      const myUrl = new URL(req.url, `http://${req.headers.host}`);

      const pathName = myUrl.pathname.replace(/\.\.\//g, '');

      const destination = pathName.replace(/^\/file(\/)?|\/$/, '')
        || 'index.html';

      const data = fs.readFileSync(`./public/${destination}`);

      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.end(data);
    } catch (error) {
      res.statusCode = 404;
      res.end();
    }
  });

  server.listen(3000, () => console.log('Server running'));
};

staticFiles();

module.exports = { staticFiles };
