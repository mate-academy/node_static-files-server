'use strict';

const http = require('http');
const { sendResponse, parseUrl, validate } = require('./utils/helpers');
const { statusCodes, errorMessages } = require('./utils/constants');

function createServer() {
  const server = http.createServer((req, res) => {
    const { INTERNAL_SERVER_ERROR } = statusCodes;
    const pathname = parseUrl(req);

    try {
      validate(res, pathname);
    } catch {
      sendResponse(res, INTERNAL_SERVER_ERROR, {
        errors: [{ message: errorMessages.internalError }],
      });
    }
  });

  return server;
}

module.exports = {
  createServer,
};
