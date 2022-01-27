'use strict';

const http = require('http');
const fsPromises = require('fs/promises');

const PORT = process.env.PORT || 8080;

const getInstructionResponse = () => {
  return '<h1>Path to get data from the server - /file</h1>'
    + '<div>For example:</div>'
    + 'Url to get index.html - http://host:port/file/index.html';
};

const getDefaultResponse = async(urlPath) => {
  const pathToFile = urlPath.slice(1).join('/');
  const path = pathToFile
    ? `public/${pathToFile}`
    : `public/index.html`;
  const data = await fsPromises.readFile(path);

  return data;
};

const getErrorResponse = async() => {
  const data = await fsPromises.readFile('public/404.html');

  return data;
};

const server = http.createServer(async(req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const urlPath = url.pathname.slice(1).split('/');

    if (urlPath[0] !== 'file') {
      res.end(getInstructionResponse());
    } else {
      res.end(await getDefaultResponse(urlPath));
    }
  } catch (error) {
    res.statusCode = 404;
    res.end(await getErrorResponse());
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Sever is starting on port ${PORT}`);
});
