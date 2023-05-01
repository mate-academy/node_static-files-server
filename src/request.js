'use strict';

const axios = require('axios');

const baseUrl = 'http://localhost:5001/file/index.html';

axios
  .get(baseUrl)
  .then((res) => {
    // eslint-disable-next-line no-console
    console.log(res.status);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log('Error occured ', error);

    return error;
  });
