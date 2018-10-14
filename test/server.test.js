const supertest = require(`supertest`);
const assert = require(`assert`);
const {app} = require(`../src/server`);

const sent = {
  scale: 0,
  effect: `marvin`,
  filename: {
    mimetype: `image/jpeg`,
    originalname: `2049.jpg`
  }
};

describe(`GET`, () => {
  describe(`GET /api/posts`, () => {
    it(`get all posts`, async () => {
      const response = await supertest(app)
        .get(`/api/posts`)
        .set(`Accept`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/);

      const posts = response.body;
      assert.strictEqual(posts.length, 17);
    });
    it(`get all posts with / at the end`, async () => {
      const response = await supertest(app)
        .get(`/api/posts/`)
        .set(`Accept`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/);

      const posts = response.body;
      assert.strictEqual(posts.length, 17);
    });
    it(`get data from unknown resource`, async () => {
      return await supertest(app)
        .get(`/api/oneone`)
        .set(`Accept`, `application/json`)
        .expect(404)
        .expect(`Page was not found`)
        .expect(`Content-Type`, /html/);
    });
  });
  describe(`GET /api/posts/:date`, () => {
    it(`get post with date 1 Jun 2019`, async () => {
      const date = new Date(2049, 0, 1).valueOf();
      const response = await supertest(app)
        .get(`/api/posts/${date}`)
        .set(`Accept`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/);

      const post = response.body;
      assert.strictEqual(post.date, date);
    });
    it(`get post with / at the end`, async () => {
      const date = new Date(2049, 0, 1).valueOf();
      const response = await supertest(app)
        .get(`/api/posts/${date}/`)
        .set(`Accept`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/);

      const post = response.body;
      assert.strictEqual(post.date, date);
    });
  });
});

describe(`POST`, () => {
  describe(`POST /api/posts/`, () => {
    it(`send post as json`, async () => {
      const response = await supertest(app)
        .post(`/api/posts`)
        .send(sent)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/);


      const post = response.body;
      assert.deepEqual(post, sent);
    });
    it(`send post as multipart/form-data`, async () => {
      const response = await supertest(app)
        .post(`/api/posts`)
        .field(`scale`, `0`)
        .field(`effect`, `marvin`)
        .attach(`filename`, `test/img/2049.jpg`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `multipart/form-data`)
        .expect(200)
        .expect(`Content-Type`, /json/);


      const post = response.body;
      assert.deepEqual(post, sent);
    });

    it(`send post without required field as json`, async () => {
      const sentError = {
        effect: `marvin`,
        filename: {
          mimetype: `image/jpeg`,
          originalname: `2049.jpg`
        }
      };

      const response = await supertest(app)
        .post(`/api/posts`)
        .send(sentError)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `application/json`)
        .expect(400)
        .expect(`Content-Type`, /json/);


      const post = response.body;
      assert.deepEqual(post[0].fieldName, `scale`);
    });
    it(`send post with error scale field as multipart/form-data`, async () => {
      const response = await supertest(app)
        .post(`/api/posts`)
        .field(`scale`, `200`)
        .field(`effect`, `marvin`)
        .attach(`filename`, `test/img/2049.jpg`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `multipart/form-data`)
        .expect(400)
        .expect(`Content-Type`, /json/);


      const post = response.body;
      assert.deepEqual(post[0].fieldName, `scale`);
    });
  });
});
