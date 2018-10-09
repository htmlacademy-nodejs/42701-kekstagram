const http = require(`http`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const {parse} = require(`url`);
const {extname} = require(`path`);

const readfile = promisify(fs.readFile);
const {STATUS_CODES: codes} = http;

const hostname = `127.0.0.1`;
const defaultPort = 3000;
const fileDir = `./static/`;
const file = (path) => fileDir + path;
const TYPES = {
  'css': `text/css`,
  'html': `text/html; charset=UTF-8`,
  'jpg': `image/jpeg`,
  'png': `image/png`,
  'ico': `image/x-icon`
};

const indexPage = file(`index.html`);

const getIndexPage = async (res) => {
  try {
    const data = await readfile(indexPage, `utf8`);

    res.setHeader(`Content-Type`, TYPES.html);
    res.statusCode = 200;
    res.end(data);

  } catch (err) {
    console.error(err);
    res.statusCode = 400;
    res.end(codes[400]);
  }
};

const getFile = async (url, res) => {
  try {
    const ext = extname(url.path).slice(1);
    const type = TYPES[ext] || `text/plain`;

    const data = await readfile(file(url.path));

    res.setHeader(`Content-Type`, type);
    res.statusCode = 200;
    res.end(data);

  } catch (err) {
    console.error(err);
    res.statusCode = 400;
    res.end(codes[400]);
  }
};

const server = http.createServer((req, res) => {
  const url = parse(req.url);

  if (url.path === `/`) {
    getIndexPage(res);
  } else {
    getFile(url, res);
  }
});


const start = (port = defaultPort) => {
  server.listen(port, hostname, () => {
    console.log(`Server started at: http://${hostname}:${port}`);
  });
};

module.exports = {
  start
};
