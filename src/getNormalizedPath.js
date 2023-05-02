'use strict';

const url = require('url');

const getNormalizedPath = (requestUrl, requestHost) => {
  const normalizedUrl = new url.URL(
    requestUrl,
    `http://${requestHost}`
  );

  if (!normalizedUrl.pathname.startsWith('/file')) {
    return '';
  }

  const validPathanme = normalizedUrl.pathname === '/file'
    ? '/'
    : normalizedUrl.pathname.slice(5);

  const path = `./public${validPathanme}`;
  const sourcePath = path === './public/'
    ? `${path}index.html`
    : path;

  return sourcePath;
};

module.exports = {
  getNormalizedPath,
};
