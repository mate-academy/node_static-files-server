# Static files server
Create a server that will return files using a part of the path after `/file/`

- Return only files from a folder `public`
- There should not be access to any other files
- Return 404 status for non existent files
- If the `pathname` does not start with `/file/` return a message with a hint how to load files

Examples:
- `/file/index.html` returns `public/index.html`
- `/file/styles/main.css` returns `public/styles/main.css`
- `/file/` and `/file` returns `public/index.html`
