'use strict';

const { staticFilesServer } = require('./staticFilesServer');

staticFilesServer().listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server started! 🚀');
});
