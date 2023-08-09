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
      res.end('Start request with "file"');
      res.statusCode = 400;
      res.statusMessage = 'Bad request';

      return;
    }

    try {
      const url = new URL(req.url, `http://${req.headers.host}`);

      const pathName = url.pathname
        .slice(1).split('/').filter(d => d.trim() !== '');
      let dest = pathName.join('/').replace('file', 'public');

      if (pathName.length === 1) {
        dest = 'public/index.html';
      }

      const data = fs.readFileSync(`./${dest}`);

      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.end(data);
    } catch (error) {
      res.statusCode = 404;
      console.log(error);
      res.end();
    }
  });

  server.listen(3000, () => console.log('Server running'));
};

staticFiles();

module.exports = { staticFiles };
