const multer = require(`multer`);
const express = require(`express`);
const {Duplex} = require(`stream`);
const logger = require(`../logger`);

// eslint-disable-next-line new-cap
const router = express.Router();
const validate = require(`./validate`);
const NotFoundError = require(`../error/not-found`);
const htmlTemplate = require(`./template`);
const {ERROR_HANDLER, NOT_FOUND_HANDLER} = require(`../error/handlers`);

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

const toPage = async (cursor, skip = SKIP, limit = LIMIT, html) => {
  const data = await cursor.skip(skip).limit(limit).toArray();
  const result = {
    data: data.map(format),
    skip,
    limit,
    total: await cursor.count(),
  };
  return html ? htmlTemplate(result) : result;
};

router.get(``, asyncWrap(async (req, res) => {
  const skip = parseInt(req.query.skip, 10) || SKIP;
  const limit = parseInt(req.query.limit, 10) || LIMIT;
  const htmlAccept = req.get(`Accept`).includes(`text/html`);

  const data = await router.postsStore.allPosts;


  res.send(await toPage(data, skip, limit, htmlAccept));
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


router.use(ERROR_HANDLER);
router.use(NOT_FOUND_HANDLER);

module.exports = (postsStore, imageStore) => {
  router.postsStore = postsStore;
  router.imageStore = imageStore;
  return router;
};
