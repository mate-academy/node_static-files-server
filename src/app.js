/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
/**
 * Implement sum function:
 *
 * Function takes 2 numbers and returns their sum
 *
 * sum(1, 2) === 3
 * sum(1, 11) === 12
 *
 * @param {number} a
 * @param {number} b
 *
 * @return {number}
 */

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

  const fileName = normalizedUrl.pathname.slice(1);
  const names = fileName.split('/');

  if (names[0] !== 'file') {
    res.end('You should start with /file/.....');

    return;
  }

  const correctPath = names.slice(1).join('/') || 'index.html';

  if (!fs.existsSync(`./public/${correctPath}`)) {
    res.end('No such file in directory');

    return;
  }

  fs.readFile(`./public/${correctPath}`, (err, data) => {
    if (!err) {
      res.end(data);
    }

    res.statusCode = 404;
    res.end();
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
