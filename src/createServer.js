'use strict';

const http = require('node:http');
const path = require('node:path');
const fsp = require('node:fs/promises');
const publicFolderPath = path.resolve(__dirname, '..', 'public');

function createServer() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (
      req.url.includes('../') ||
      (!url.pathname.startsWith('/file/') && path.extname(url.pathname))
    ) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad request');
    }

    if (req.url.includes('//')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Not found');
    }

    if (url.pathname === '/file') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('To load a file, use paths like /file/filename.ext');
    }

    if (!url.pathname.startsWith('/file/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('To load a file, use paths like /file/filename.ext');
    }

    let filePath = url.pathname.slice(6);

    if (filePath === '') {
      filePath = 'index.html';
    }

    const realPath = path.resolve(publicFolderPath, filePath);
    const relativePath = path.relative(publicFolderPath, realPath);

    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/plain');

      return res.end('Bad request');
    }

    try {
      const file = await fsp.readFile(realPath, 'utf-8');
      const ext = path.extname(realPath);
      let contentType = 'text/plain';

      if (ext === '.html') {
        contentType = 'text/html';
      } else if (ext === '.css') {
        contentType = 'text/css';
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(file);
    } catch {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not found');
    }
  });

  return server;
}

module.exports = {
  createServer,
};
