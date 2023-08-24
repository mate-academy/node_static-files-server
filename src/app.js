'use strict';

const { createServer } = require('http');
const { URL: NodeURL } = require('url');
const fs = require('fs/promises');
const path = require('path');

createServer(async(req, res) => {
  res.setHeader('Content-type', 'application/json');

  const newUrl = new NodeURL(req.url, `http://${req.headers.host}`);
  const pathWithoutFile = newUrl.pathname.replace('/file/', '');
  const publicFolderPath = path.resolve(__dirname, '..', 'public');

  if (pathWithoutFile.length && newUrl.pathname.slice(0, 6) === '/file/') {
    try {
      const fullPath = path.join(publicFolderPath, pathWithoutFile);
      const content = await fs.readFile(fullPath);

      res.end(content.toString());

      return;
    } catch (error) {
      const nameOfFile = pathWithoutFile
        .slice(pathWithoutFile.lastIndexOf('/') + 1);

      res.writeHead(404, 'Not found');
      res.end(`There is not such file as ${nameOfFile} `);

      return;
    }
  }

  res.end(`Add path in url to load the file. Usage: /flag/your_path`);
}).listen(8080, () => {
  // eslint-disable-next-line no-console
  console.log('Server has been started');
});
