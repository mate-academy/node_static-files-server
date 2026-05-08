'use strict';

const http = require('http');
const { notFound, badRequest, hint } = require('./helpers/responses');
const { fileOutput } = require('./handlers/fileHandler');

function createServer() {
  const server = http.createServer((req, res) => {
    const rawUrl = req.url.split('?')[0];

    let decodedUrl;

    try {
      decodedUrl = decodeURIComponent(rawUrl);
    } catch (e) {
      return badRequest(res);
    }

    if (decodedUrl.includes('//')) {
      return notFound(res);
    }

    if (decodedUrl.includes('..') || !decodedUrl.startsWith('/file')) {
      return badRequest(res);
    }

    const urlArr = decodedUrl.split('/').filter(Boolean);

    if (decodedUrl === '/file' || urlArr[0] !== 'file') {
      return hint(res);
    }

    const filename = 'public/' + urlArr.slice(1).join('/');

    fileOutput(res, filename);
  });

  return server;
}

module.exports = {
  createServer,
};
