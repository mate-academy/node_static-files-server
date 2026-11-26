'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const publicPath = path.resolve(__dirname, '..', 'public');

const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
};

const createServer = () => {
  const server = http.createServer(async (req, res) => {
    const [pathname] = req.url.split('?');

    res.setHeader('Content-Type', 'text/plain');

    if (pathname.includes('../')) {
      res.statusCode = 400;
      res.end('Bad request');

      return;
    }

    if (pathname.includes('//')) {
      res.statusCode = 404;
      res.end('Not found');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.end('Use /file/<filename> to load a file');

      return;
    }

    const relativePath = pathname.slice('/file/'.length) || 'index.html';
    const filePath = path.resolve(publicPath, relativePath);

    if (
      filePath !== publicPath &&
      !filePath.startsWith(publicPath + path.sep)
    ) {
      res.statusCode = 400;
      res.end('Bad request');

      return;
    }

    try {
      const realPublicPath = await fs.promises.realpath(publicPath);
      const realFilePath = await fs.promises.realpath(filePath);

      if (
        realFilePath !== realPublicPath &&
        !realFilePath.startsWith(realPublicPath + path.sep)
      ) {
        res.statusCode = 400;
        res.end('Bad request');

        return;
      }

      const stats = await fs.promises.stat(realFilePath);

      if (!stats.isFile()) {
        res.statusCode = 404;
        res.end('File not found');

        return;
      }

      const data = await fs.promises.readFile(realFilePath);
      const extension = path.extname(filePath);

      res.statusCode = 200;
      res.setHeader('Content-Type', contentTypes[extension] || 'text/plain');
      res.end(data);
    } catch {
      res.statusCode = 404;
      res.end('File not found');
    }
  });

  return server;
};

module.exports = { createServer };
