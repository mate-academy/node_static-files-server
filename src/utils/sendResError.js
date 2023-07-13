'use strict';

function sendResError(res, message, status = 400) {
  res.statusCode = status;
  res.statusMessage = message;
  res.end();
}

module.exports = {
  sendResError,
};
