'use strict';

const path = require('path');
const basePathToFiles = path.join('public');
const partToOpenFile = '/file/';

async function getPathToFile(request) {
  const url = request.url;

  if (!url.startsWith(partToOpenFile)) {
    /* eslint-disable max-len */
    const error = new Error(`Wrong pathname. It have to be like this: ${partToOpenFile}filename.ext`);

    error.code = 200;
    throw error;
  }

  const pathname = url.slice(partToOpenFile.length);

  if (pathname.includes('..')) {
    const error = new Error(`Traversing out of the current directory is not allowed`);

    error.code = 400;
    throw error;
  }

  return path.join(basePathToFiles, pathname);
}

module.exports = {
  getPathToFile,
};
