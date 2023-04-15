'use strict';

const { staticServer } = require('./staticServer');

const PORT = process.env.PORT || 8080;

staticServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server is running at http://localhost:${PORT}`);
});
