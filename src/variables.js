'use strict';

const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

const ERROR = {
  INVALID_REQUEST: 'Invalid request. Not allowed traversal paths',
  NOT_FOUND: 'File not found',
  SERVER_ERROR: 'Internal Server Error',
};

module.exports = {
  ERROR,
  STATUS_CODES,
};
