const url = require('url');

const validateUrl = (req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  const normilizedPath = new url.URL(req.url, `http://${req.headers.host}`)
    .pathname;

  if (normilizedPath.includes('//')) {
    res.statusCode = 404;
    res.end('there is no such file');

    return;
  }

  if (normilizedPath === '/file/' || normilizedPath === '/file') {
    res.statusCode = 200;

    res.end(
      'Path should start with /file/. Correct path is: "/file/<FILE_NAME>".',
    );

    return;
  }

  if (!normilizedPath.startsWith('/file/')) {
    res.statusCode = 400;
    res.end('Request should not contain traversal paths.');

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
