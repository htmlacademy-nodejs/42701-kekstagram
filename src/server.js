const express = require(`express`);
const path = require(`path`);
const logger = require(`./logger`);

const postsStore = require(`./posts/store`);
const imageStore = require(`./images/store`);
const postRouter = require(`./posts/route`)(postsStore, imageStore);

const app = express();

const {
  SERVER_PORT = 3000,
  SERVER_NAME = `localhost`,
} = process.env;

const staticPath = path.resolve(__dirname, `../static/`);

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};

const ERROR_HANDLER = (err, req, res, _next) => {
  if (err) {
    logger.error(err.message, err);
    res.status(err.code || 500).send(err.message);
  }
};

const CORS_HANDLER = (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': `*`,
    'Access-Control-Allow-Headers': `Origin, X-Requested-With, Content-Type, Accept`
  });
  next();
};

app.use(CORS_HANDLER);

app.use(express.static(staticPath));
app.use(`/api/posts`, postRouter);

app.use(NOT_FOUND_HANDLER);
app.use(ERROR_HANDLER);

const start = (port) => {
  app.listen(port = SERVER_PORT, SERVER_NAME, () => logger.info(`Server start at http://${SERVER_NAME}:${port}`));
};

module.exports = {
  start,
  app,
};


if (require.main === module) {
  start();
}
