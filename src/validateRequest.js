'use strict';

const validateRequest = (fileName) => {
  const result = {
    code: 0,
    message: '',
  };

  if (fileName.includes('..') || !fileName.includes('file')) {
    result.code = 400;
    result.message = 'Bad Request';

    return result;
  }

  if (!fileName.startsWith('file/')) {
    result.code = 200;
    result.message = "Request should start with '/file/'";

    return result;
  }

  if (fileName.includes('//')) {
    result.code = 404;
    result.message = "Request shouldn't contain duplicate slashes";

    return result;
  }

  return result;
};

module.exports = {
  validateRequest,
};
