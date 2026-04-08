/* eslint-disable no-console */
const path = require('path');

const validateRequest = (req) => {
  const result = {
    code: null,
    message: null,
    finalPath: null,
  };

  if (req.url.includes('//')) {
    result.code = 404;
    result.message = 'Double slashes are prohibited!';

    return result;
  }

  if (req.url.includes('..')) {
    result.code = 400;
    result.message = 'Access denied!';

    return result;
  }

  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

  if (!normalizedURL.pathname.startsWith('/file')) {
    result.code = 400;

    result.message =
      'Hint: to download a file from public dir, use /file/ prefix';

    return result;
  }

  const filePath = normalizedURL.pathname.replace('/file', '') || 'index.html';

  const finalPath = path.join(__dirname, '../public', filePath);
  const publicDir = path.resolve(__dirname, '../public');

  if (!finalPath.startsWith(publicDir)) {
    result.code = 400;
    result.message = 'Access denied!';

    return result;
  }

  result.finalPath = finalPath;

  return result;
};

module.exports = { validateRequest };
