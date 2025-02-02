# Static files server

**Read [the guideline](https://github.com/mate-academy/js_task-guideline/blob/master/README.md) before start**

Create a server that will return files using a part of the path after `/file/`

- Return only files from a folder `public`
- There should not be access to any other files
- Return 404 status for non existent files
- If the `pathname` does not start with `/file/` return a message with a hint how to load files

Examples:

- `/file/index.html` returns `public/index.html`
- `/file/styles/main.css` returns `public/styles/main.css`
- `/file/` and `/file` return `public/index.html`

  return

  http.createServer((req, res) => {

  if (req.url.includes('//')) {
  res.statusCode = 404;
  res.end();
  return;
  }

  res.setHeader('Content-Type', 'text/plain');

  const normalizedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (!normalizedUrl.pathname.startsWith('/file')) {
  res.statusCode = 400;

      res.end(
        `If you want load file, you must write path in this format "/file/FILE_NAME"`,
      );

      return;

  }

  const filePath =
  './public/' + (normalizedUrl.pathname.split('/file/')[1] || 'index.html');

  if (!fs.existsSync(filePath)) {
  res.statusCode = 404;
  res.end("File doesn't exists");

      return;

  }

  fs.readFile(filePath, (err, data) => {
  if (err) {
  res.statusCode = 404;
  res.end();

        return;
      }

      res.end(data);

  });
  });
