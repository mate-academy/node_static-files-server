'use strict';

const FIRST_PATH_PART = 'file';

const isPathValid = (path) => {
  const pathParts = path.split('/');
  const startsWithRightPart = pathParts[0] === FIRST_PATH_PART;
  const hasAttemptedToGetAccessOutsideDirectory = path.includes('../');

  return !hasAttemptedToGetAccessOutsideDirectory
    && startsWithRightPart;
};

const normalizePath = (path) => path.split('/').slice(1).join('/');

module.exports = {
  isPathValid,
  normalizePath,
};
