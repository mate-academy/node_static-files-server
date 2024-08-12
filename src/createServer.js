'use strict';

const http = require('http');
const fs = require('fs');

const PUBLIC_FOLDER = './public/';

const sendErrorResponse = (res, statusCode, message) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/plain');
  res.end(message);
};

const createServer = () => {
  const server = http.createServer(async (req, res) => {
    const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = normalizedUrl.pathname;

    if (pathname.includes('//')) {
      sendErrorResponse(res, 404, 'To load files, use the /file/ path');

      return;
    }

    if (pathname === '/file') {
      sendErrorResponse(res, 200, 'To load files, use the /file/ path');

      return;
    }

    if (!pathname.startsWith('/file/')) {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 400;
      res.end('To load files, use the /file/ path');

      return;
    }

    const fileName = pathname.replace('/file/', '') || 'index.html';

    res.setHeader('Content-type', 'text/plain');

    try {
      const data = await fs.promises.readFile(`${PUBLIC_FOLDER}${fileName}`);

      res.statusCode = 200;
      res.end(data);
    } catch (err) {
      sendErrorResponse(res, 404, "Such file doesn't exist");
    }
  });

  server.on('error', (err) => {
    // eslint-disable-next-line
    console.error('Server error:', err);
  });

  return server;
};

module.exports = {
  createServer,
};
