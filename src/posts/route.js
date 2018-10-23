const multer = require(`multer`);
const express = require(`express`);
const {Duplex} = require(`stream`);
const MongoError = require(`mongodb`).MongoError;
const logger = require(`../logger`);

// eslint-disable-next-line new-cap
const router = express.Router();
const validate = require(`./validate`);
const ValidateError = require(`../error/validate`);
const NotFoundError = require(`../error/not-found`);

const jsonParse = express.json();
const upload = multer();

const SKIP = 0;
const LIMIT = 50;

const asyncWrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const toStream = (buffer) => {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const format = (data) => {
  const {
    date,
    description,
    effect,
    hashtags,
    likes,
    scale,
  } = data;

  const result = {
    url: `/api/posts/${date}/image`,
    description,
    effect,
    hashtags,
    likes,
    scale,
    date,
  };

  return result;
};

const toPage = async (cursor, skip = SKIP, limit = LIMIT) => {
  const data = await cursor.skip(skip).limit(limit).toArray();
  const result = {
    data: data.map(format),
    skip,
    limit,
    total: await cursor.count(),
  };
  return result;
};

router.get(``, asyncWrap(async (req, res) => {
  const skip = parseInt(req.query.skip, 10) || SKIP;
  const limit = parseInt(req.query.limit, 10) || LIMIT;

  const data = await router.postsStore.allPosts;

  res.send(await toPage(data, skip, limit));
}));

router.get(`/:date`, asyncWrap(async (req, res) => {
  const date = parseInt(req.params.date, 10);
  const post = await router.postsStore.getPost(date);
  if (!post) {
    throw new NotFoundError(`Пост с датой ${date} не найден!`);
  }

  res.send(post);
}));

router.get(`/:date/image`, asyncWrap(async (req, res) => {
  const date = parseInt(req.params.date, 10);
  const post = await router.postsStore.getPost(date);
  if (!post) {
    throw new NotFoundError(`Пост с датой ${date} не найден!`);
  }

  const {stream, info} = await router.imageStore.get(post._id);
  if (!stream) {
    throw new NotFoundError(`Аватар не найден!`);
  }

  res.set({
    'Content-Type': post.filename.mimetype,
    'Content-Length': info.length
  });

  res.on(`error`, (e) => logger.error(`Error with GET /:date/image response`, e));
  res.on(`end`, () => res.end());

  stream.on(`error`, (e) => logger.error(`Error with /:date/image stream`, e));
  stream.on(`end`, () => res.end());
  stream.pipe(res);
}));

router.post(``, jsonParse, upload.single(`filename`), asyncWrap(async (req, res, _next) => {
  const {body, file} = req;

  if (file) {
    const {mimetype, originalname} = file;
    body.filename = {
      mimetype,
      name: originalname
    };
  }

  const validated = validate(body);
  validated.date = Date.now();
  const result = await router.postsStore.save(validated);
  const insertedId = result.insertedId;

  if (file) {
    await router.imageStore.save(insertedId, toStream(file.buffer));
    res.type(file.mimetype);
    res.send(file.buffer);
    return;
  }

  res.send(validated);
}));


const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Page was not found`);
};
const ERROR_HANDLER = (err, req, res, _next) => {
  logger.error(err.message, err);
  if (err instanceof ValidateError) {
    res.status(err.code).json(err.errors);
    return;
  } else if (err instanceof MongoError) {
    res.status(400).json(err.message);
    return;
  }
  res.status(err.code || 500).send(err.message);
};

router.use(ERROR_HANDLER);
router.use(NOT_FOUND_HANDLER);

module.exports = function (postsStore, imageStore) {
  router.postsStore = postsStore;
  router.imageStore = imageStore;
  return router;
};
