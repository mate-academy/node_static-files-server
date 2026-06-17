const http = require('http');
const { sendTextResponse } = require('./sendResponse');
const { readFileByPath } = require('./getFilePath');
const { getError } = require('./error');
const url = require('url');

const createServer = () => {
  const server = http.createServer(async (req, res) => {
    try {
      const normalizedUrl = new url.URL(
        req.url || '',
        `http://${req.headers.host}`,
      );

      const requestedPath = normalizedUrl.pathname.slice(1);
      const error = getError(requestedPath);

      if (error) {
        return sendTextResponse(res, ...error);
      }

      try {
        const { data } = await readFileByPath(requestedPath);

        return sendTextResponse(res, 200, data, 'OK');
      } catch (err) {
        sendTextResponse(res, 404, err.message);
      }
    } catch (error) {
      sendTextResponse(res, 500, error.message, 'Internal Server Error');
    }
  });

  return server;
};

module.exports = { createServer };
