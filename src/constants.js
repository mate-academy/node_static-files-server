const statusCodes = {
  200: 200,
  404: 404,
  400: 400,
};

const statusMessages = {
  noFile: 'there is no such file',
  requestStart: 'request should starts with "file"',
  incorrectPath:
    'Path should start with /file/. Correct path is: "/file/<FILE_NAME>".',
  traversalPath: 'Request should not contain traversal paths.',
};

module.exports = { statusMessages, statusCodes };
