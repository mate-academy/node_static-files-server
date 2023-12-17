'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;

const HTTPMsg = {
  ok: 'OK',
  badRequest: 'Bad request',
  notFound: 'Not Found',
  internalError: 'Internal Server Error',
};

const errorMsg = {
  invalidPath:
    'Please provide url starting with /file/',
  notFound:
    'The file you requested was not found',
  internalError:
    'We cannot provide that information right now. Please try again later.',
};

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const normalizedURL = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = normalizedURL.pathname;

  if (!pathname.startsWith('/file')) {
    res.statusCode = HTTP_BAD_REQUEST;
    res.statusText = HTTPMsg.badRequest;
    res.end(errorMsg.invalidPath);
  }

  const fileRelativePath = pathname === '/file/' || pathname === '/file'
    ? '/public/index.html'
    : `/public/${pathname.slice(6)}`;

  const fileAbsolutePath = path.join(path.resolve(), fileRelativePath);

  fs.access(fileAbsolutePath, (err) => {
    if (err) {
      res.statusCode = HTTP_NOT_FOUND;
      res.statusText = HTTPMsg.notFound;
      res.end(errorMsg.notFound);
    } else {
      fs.readFile(fileAbsolutePath, 'utf8', (error, data) => {
        if (error) {
          res.statusCode = HTTP_INTERNAL_SERVER_ERROR;
          res.statusMessage = HTTPMsg.internalError;
          res.end();
        } else {
          res.statusCode = HTTP_OK;
          res.statusText = HTTPMsg.ok;
          res.end(JSON.stringify(data));
        }
      });
    }
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${PORT}`);
});
