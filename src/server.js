const express = require(`express`);
const path = require(`path`);
const postRouter = require(`./routes/posts`);

const app = express();
const defaultPort = 3000;
const staticPath = path.resolve(__dirname, `../static/`);

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};

const ERROR_HANDLER = (err, req, res, _next) => {
  if (err) {
    console.error(err);
    res.status(err.code || 500).send(err.message);
  }
};

app.use(express.static(staticPath));
app.use(`/api/posts`, postRouter);

app.use(NOT_FOUND_HANDLER);
app.use(ERROR_HANDLER);

const start = (port = defaultPort) => {
  app.listen(port, () => console.log(`Server start at http://localhost:${port}`));
};

module.exports = {
  start,
  app,
};


if (require.main === module) {
  start();
}
