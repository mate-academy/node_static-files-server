'use strict';

const http = require('node:http');
const path = require('node:path');
const fsp = require('node:fs/promises');

function createServer() {
  return http.createServer(async (req, res) => {
    const url = req.url;

    if (url.includes('../')) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 400;

      return res.end(`Bad request!`);
    }

    if (url.includes('//')) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;

      return res.end(`Bad reqest!`);
    }

    const filesPath = '/file/';

    if (!url.startsWith(filesPath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;

      return res.end(`Path should start with "${filesPath}"`);
    }

    try {
      const fileName = url.slice(filesPath.length);
      const realPath = path.join(__dirname, '..', 'public', fileName);
      const file = await fsp.readFile(realPath, 'utf-8');

      res.statusCode = 200;

      if (fileName.slice(-4) === '.css') {
        res.setHeader('Content-Type', 'text/css');
      } else {
        res.setHeader('Content-Type', 'text/html');
      }
      res.end(file);
    } catch (error) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;
      res.end('Not Found!');
    }
  });
}

module.exports = {
  createServer,
};
