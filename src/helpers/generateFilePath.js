'use strict';

const generateFilePath = (reqPath) => {
  const basePath = './public/';

  const reqBase = reqPath.startsWith('/file/') ? '/file/' : '/file';

  const filePath = reqPath.replace(reqBase, '') || 'index.html';

  return (basePath + filePath);
};

module.exports = {
  generateFilePath,
};
