/* eslint-disable no-console */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  const PUBLIC_DIR = 'public';
  const PUBLIC_DIR_PATH = path.resolve(__dirname, `../${PUBLIC_DIR}`);
  const FILE_PATH = '/file/';
  const INDEX = 'index.html';

  return http.createServer(async(req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const { pathname } = new URL(
      req.url,
      `http://${req.headers.host}`
    );

    if (!pathname.startsWith(FILE_PATH)) {
      res.statusCode = 200;
      res.end('Invalid request. Please start your path with "/file/"');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('File not found');

      return;
    }

    const pathParts = pathname.split('/')
      .filter(part => !!part)
      .slice(1);

    if (!pathParts.length) {
      pathParts.push(INDEX);
    }

    const filePath = path.join(PUBLIC_DIR_PATH, ...pathParts);

    try {
      const data = await fs.promises.readFile(filePath);

      res.end(data);
    } catch (err) {
      res.statusCode = 404;
      res.end('File not found');
    }
  });
}

module.exports = {
  createServer,
};
