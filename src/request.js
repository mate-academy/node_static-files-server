/* eslint-disable no-console */
const axios = require('axios');

axios
  .get('http://localhost:5701/file')
  .then((res) => {
    console.log('SUCCESS headers:', res.headers);
    console.log('SUCCESS data:', res.data);
  })
  .catch((error) => {
    if (error.response) {
      // Server responded with a status != 2xx
      console.log('ERROR status:', error.response.status);
      console.log('ERROR headers:', error.response.headers);
      console.log('ERROR data:', error.response.data);
    } else if (error.request) {
      // Request was sent, but no response received
      console.log('No response received');
    } else {
      // Something else went wrong
      console.log('Error message:', error.message);
    }
  });
