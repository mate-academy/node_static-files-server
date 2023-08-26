'use strict';

const { staticFilesServer } = require('./staticFilesServer');
const PORT = 8080;

staticFilesServer().listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on ${PORT} port.`);
});
