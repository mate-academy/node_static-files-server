import http from 'http';
import fs from 'fs';

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const normalizedURL = new URL(req.url, `http://${req.headers.host}`);

  const { normalizedPath, massage } = getNormalizedPath(normalizedURL.pathname);

  if (massage) {
    res.end(massage);
  }

  if (fs.existsSync(normalizedPath)) {
    fs.readFile(normalizedPath, (err, data) => {
      if (err) {
        res.end(`${normalizedPath} is not a file, write path correctly!`);
      }

      res.end(data);
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

const getNormalizedPath = function(path) {
  let normalizedPath = path.slice(1).split('/').filter(item => item);
  let massage = '';

  if (normalizedPath[0] !== 'file') {
    massage = ' Path must start with: /file/ ';
  }

  if (normalizedPath[0] === 'file') {
    normalizedPath.splice(0, 1, 'public');

    normalizedPath = normalizedPath.length === 1
      ? [...normalizedPath, 'index.html']
      : normalizedPath;
  }

  return {
    normalizedPath: normalizedPath.join('/'),
    massage,
  };
};

server.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}/`);
});
