const path = require('path');
const url = require('url');

const validateUrl = (req, res) => {
  const normilizedUrl = new url.URL(req.url, `http://${req.headers.host}`);
  const pathToFile = normilizedUrl.pathname;

  if (req.url.includes('/app.js')) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('there is no such file');

    return;
  }

  if (pathToFile.includes('//')) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('there is no such file');

    return;
  }

  let restOfPath = '../public/';

  if (pathToFile.includes('file')) {
    const verifiedPath = pathToFile.slice(6);

    restOfPath += verifiedPath;

    if (!verifiedPath.length) {
      restOfPath += 'index.html';
    }
  }

  const fullPath = path.join(__dirname, restOfPath);

  return fullPath;
};

module.exports = { validateUrl };
