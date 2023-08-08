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
      console.log('Start request with "file"');
      res.end();

      return;
    }

    try {
      const pathSet = new Set(req.url.split('/'));

      pathSet.delete('');

      const pathName = [...pathSet];

      let dest = pathName.join('/');

      if (pathName.length === 1) {
        dest = 'public/index.html';
      }

      const data = fs.readFileSync(`./${dest}`);

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
