/* eslint-disable no-console */
'use strict';

const http = require('http');
const fsp = require('fs/promises');
const mime = require('mime-types');
const { validateRequest } = require('./validateRequest');

function createServer() {
  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const { code, message, finalPath } = validateRequest(req);

    if (code) {
      res.statusCode = code;

      return res.end(message);
    }

    try {
      const file = await fsp.readFile(finalPath);
      const contentType = mime.lookup(finalPath) || 'text/plain';

      console.log('contentType', contentType);
      res.statusCode = 200;
      // res.setHeader('Content-Type', contentType);
      res.end(file);
    } catch (error) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;
      res.end(`File not Found`);
    }
  });

  return server;
}

module.exports = {
  createServer,
};
