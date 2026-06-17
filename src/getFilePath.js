const fs = require('fs').promises;
const path = require('path');

const readFileByPath = async (requestedPath) => {
  const fileName = requestedPath.replace(/^file\/?/, '') || 'index.html';

  const publicDir = path.resolve(__dirname, '../public');
  const filePath = path.resolve(publicDir, fileName);

  if (!filePath.startsWith(publicDir)) {
    throw new Error(
      'The path must not contain parent directory references (..)',
    );
  }

  try {
    const data = await fs.readFile(filePath, 'utf-8');

    return { data };
  } catch {
    throw new Error('The file does not exist at this path');
  }
};

module.exports = { readFileByPath };
