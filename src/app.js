'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const { MIME_TYPES } = require('./MIME_TYPES');

const PORT = 8000;

const STATIC_PATH = path.join(process.cwd(), './public');

const toBool = [() => true, () => false];

const prepareFile = async(url) => {
  const paths = [STATIC_PATH, url];
  const filePath = path.join(...paths);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(...toBool);
  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : STATIC_PATH + '/404.html';
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);

  return {
    found, ext, stream,
  };
};

http.createServer(async(req, res) => {
  const urlParts = req.url.split('/');

  if (urlParts[1] === 'file') {
    const url = urlParts.slice(2).join('/');
    const file = await prepareFile(url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;

    res.writeHead(statusCode, { 'Content-Type': mimeType });
    file.stream.pipe(res);
  } else {
    res.end('<h4>Start request with "/file.."</h4>');
    res.statusCode = 400;
    res.statusMessage = 'Bad request';
  }
}).listen(PORT);
