/* eslint-disable no-console */
const axios = require('axios');

const url = 'http://localhost:5701/file/asdasd/../index.html';

axios
  .get(url)
  .then((response) => {
    console.log('Response from server:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
