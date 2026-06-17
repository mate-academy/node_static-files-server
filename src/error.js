const getError = (requestedPath) => {
  if (!requestedPath.startsWith('file')) {
    return [400, 'The path to files must start with /file'];
  }

  if (requestedPath.includes('//')) {
    return [404, `The path must not contain double slashes`];
  }

  return null;
};

module.exports = {
  getError,
};
