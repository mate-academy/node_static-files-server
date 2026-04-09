/* eslint-disable*/

const axios = require('axios');

const host = 'http://localhost:5701';

const testPaths = {
  path: '/file/index.html', // 200 - should return the correct file for a valid path
  // path: '/file/styles/main.css', // 200 - should return the correct file for a valid subfolder path
  // path: '/file', // 200 - should return hint message for routes not starting with /file/
  // path: '/file/nonexistentfile.txt', // 404 - should return 404 for non-existent files
  // path: '/file//styles//main.css', // 404 - should return 404 for paths having duplicated slashes
  // path: '/file/../app.js', // 400 - should return 400 for traversal paths
};

axios
  .get(host + testPaths.path)
  .then((res) => {
    console.log('res.status: ', res.status);
    console.log('res.data: ', res.data);
  })
  .catch((err) => {
    console.log('err: ', err.response.status);
    console.log('data: ', err.response.data);
  });
