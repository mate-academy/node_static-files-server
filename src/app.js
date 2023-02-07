'use strict'

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.port || 8080;

const BASE_FILE_PATH = '../public';

const WRONG_PATH_ERROR = 'Wrong path to the file. '
 + 'There is no file in the public folder with given path.';
const PATHNAME_ERROR = 'To get the file URL path should start with \'/file\'';
const UNKNOWN_ERROR = 'Unknown error. Error message:';

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  const errors = [];
  const response = {};
  
  const sendSerializedErrorResponse = () => {
    req.statusCode = 404;
    res.statusMessage = 'Not Found';
    res.setHeader('Content-Type', 'application/json');

    response.errors = errors;

    res.end(JSON.stringify(response));
  };

  const isPathnameValid = pathname.startsWith('/file');

  if (!isPathnameValid) {
    errors.push({ message: PATHNAME_ERROR });
    sendSerializedErrorResponse();
    return;
  }

  const filePath = pathname.slice(6);
  const resolvedPath = path.resolve(__dirname, BASE_FILE_PATH, filePath);

  fs.readFile(resolvedPath, (error, data) => {
    if (error) {
      if (error.code === 'ENOENT') {
        errors.push({ message: WRONG_PATH_ERROR });
      } else {
        errors.push({ message: `${UNKNOWN_ERROR} ${error.message}` });
      }

      sendSerializedErrorResponse();
      return;
    }

    res.end(data);
  });
});

server.listen(PORT);
