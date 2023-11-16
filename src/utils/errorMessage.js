'use strict';

function errorMessage(text) {
  return JSON.stringify({
    errors: [
      {
        message: text,
      },
    ],
  });
}

module.exports = {
  errorMessage,
};
