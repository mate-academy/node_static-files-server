const http = require('http');
const path = require('path');
const fs = require('fs');

function createServer() {
  const server = http.createServer(async (req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const requestPath = pathname.replace('/file', '') || 'index.html';
    const realPath = path.join(__dirname, '..', 'public', requestPath);

    const sendResponse = (statusCode, message) => {
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'text/plain');
      res.end(message);
    };

    if (!pathname.startsWith('/file')) {
      sendResponse(
        400,
        'Error: The route must start with /file/. Example: /file/index.html',
      );

      return;
    }

    if (pathname.includes('//')) {
      sendResponse(
        404,
        'Error: The path contains duplicated slashes, which is not allowed.',
      );

      return;
    }

    fs.readFile(realPath, 'utf-8', (err, file) => {
      if (err) {
        sendResponse(404, 'Error: The requested file does not exist.');

        return;
      }
      sendResponse(200, file);
    });
  });

  return server;
}

module.exports = {
  createServer,
};
