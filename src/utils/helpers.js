const fs = require('fs');
const path = require('path');

const { errorMessages, statusCodes } = require('./constants');

function parseUrl(req) {
  const parsedUrl = new URL(req.url, 'http://localhost:5700');
  const { pathname } = parsedUrl;

  return pathname;
}

function validate(res, pathname) {
  const { failedPath, noAccess } = errorMessages;
  const { NOT_FOUND, BAD_REQUEST, OK } = statusCodes;

  if (pathname.includes('//')) {
    res.statusCode = NOT_FOUND;
    res.end(failedPath);
  } else if (!pathname.startsWith('/file')) {
    res.statusCode = BAD_REQUEST;
    res.end(noAccess);
  } else {
    let fileName = pathname.split('/file')[1];

    if (fileName?.startsWith('/')) {
      fileName = fileName.slice(1);
    }

    const destination = path.join('./public/', fileName || 'index.html');

    sendResponse(res, OK, undefined, destination);
  }
}

function sendResponse(res, statusCode, error, destination) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = statusCode;

  if (error) {
    res.end(error);
  } else {
    fs.readFile(destination, (err, data) => {
      const { notExists } = errorMessages;
      const { NOT_FOUND, OK } = statusCodes;

      if (err) {
        res.statusCode = NOT_FOUND;
        res.end(notExists);
      } else {
        res.statusCode = OK;
        res.end(data);
      }
    });
  }
}

module.exports = {
  parseUrl,
  validate,
  sendResponse,
};
