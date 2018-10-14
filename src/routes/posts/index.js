const express = require(`express`);
// eslint-disable-next-line new-cap
const postsRouter = express.Router();
const {generateData} = require(`../../generate`);
const multer = require(`multer`);

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

postsRouter.post(``, jsonParse, upload.single(`url`), (req, res) => {
  const {body, file} = req;

  if (file) {
    body.url = file.originalname;
  }

  res.send(body);
});

module.exports = postsRouter;
