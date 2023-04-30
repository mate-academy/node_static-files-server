'use strict';

const url = require('url');

const getNoramlizedPath = (requestUrl, requestHost) => {
  const normalizedUrl = new url.URL(
    requestUrl,
    `htpp://${requestHost}`
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
  getNoramlizedPath,
};
