'use strict';

const fs = require('fs/promises');

async function getFileByPath(path) {
  try {
    const file = await fs.readFile(path, 'utf-8');

    return file;
  } catch (error) {
    if (error.code === 'ENOENT') {
      const newError = new Error('File not found');

      newError.code = 404;
      throw newError;
    }

    throw error;
  }
}

module.exports = {
  getFileByPath,
};
