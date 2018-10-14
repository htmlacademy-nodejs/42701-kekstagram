const express = require(`express`);
// eslint-disable-next-line new-cap
const postsRouter = express.Router();
const {generateData} = require(`../../generate`);
const multer = require(`multer`);
const validate = require(`./validate`);
const ValidateError = require(`../../error/validate`);

const jsonParse = express.json();
const upload = multer();

const posts = generateData(17);
const skipDefault = 0;
const limitDefault = 50;

postsRouter.get(`/`, (req, res) => {
  const skip = parseInt(req.query.skip, 10) || skipDefault;
  const limit = parseInt(req.query.limit, 10) || limitDefault;
  const data = posts.slice(skip, limit + skip);

  res.send(data);
});

postsRouter.get(`/:date`, (req, res) => {
  const date = parseInt(req.params.date, 10);
  const post = posts.find((item) => {
    if (item.date === date) {
      return item;
    }

    return false;
  });

  res.send(post);
});

postsRouter.post(``, jsonParse, upload.single(`filename`), (req, res) => {
  const {body, file} = req;

  if (file) {
    const {mimetype, originalname} = file;
    body.filename = {
      mimetype,
      originalname
    };
  }

  res.send(validate(body));
});

postsRouter.use((err, req, res, _next) => {
  if (err instanceof ValidateError) {
    res.status(err.code).json(err.errors);
  }
});

module.exports = postsRouter;