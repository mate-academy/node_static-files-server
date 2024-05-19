const url = require('url');
const { statusMessages, statusCodes } = require('./constants');

const validateUrl = (req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  const normilizedPath = new url.URL(req.url, `http://${req.headers.host}`)
    .pathname;

  if (normilizedPath.includes('//')) {
    res.statusCode = statusCodes[404];
    res.end(statusMessages.noFile);

    return;
  }

  if (normilizedPath === '/file/' || normilizedPath === '/file') {
    res.statusCode = statusCodes[200];

    res.end(statusMessages.incorrectPath);

    return;
  }

  if (!normilizedPath.startsWith('/file/')) {
    res.statusCode = statusCodes[400];
    res.end(statusMessages.traversalPath);

    return;
  }

  const fileName = getNormalizedPathname(normilizedPath) || 'index.html';
  const pathToFile = `./public/${fileName}`;

  return pathToFile;
};

function getNormalizedPathname(pathname) {
  return pathname.replace('/file', '').slice(1).trim();
}

module.exports = { validateUrl };
