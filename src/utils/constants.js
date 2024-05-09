const statusCodes = {
  OK: 200,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
};

const errorMessages = {
  notExists: 'File does not exists',
  internalError: 'Internal server error',
  noAccess: 'Request should not contain traversal paths',
  failedPath: `Path should start with /file/. Correct path is: "/file/<FILE_NAME>"`,
};

module.exports = {
  statusCodes,
  errorMessages,
};
