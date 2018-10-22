const supertest = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);

const postsStoreMock = require(`./mock/posts-store-mock`);
const imageStoreMock = require(`./mock/image-store-mock`);
const postsRouter = require(`../src/posts/route`)(postsStoreMock, imageStoreMock);

const app = express();
app.use(`/api/posts`, postsRouter);

describe(`GET`, () => {
  const date = new Date(2049, 0, 1).valueOf();

  it(`GET /api/posts`, async () => {
    const response = await supertest(app)
      .get(`/api/posts`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const posts = response.body;
    assert.strictEqual(posts.length, 17);
  });
  it(`GET /api/posts/:date`, async () => {
    const response = await supertest(app)
      .get(`/api/posts/${date}`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const post = response.body;
    assert.strictEqual(post.date, date);
  });
});

describe(`POST`, () => {
  describe(``, () => {
    it(`POST /api/posts/`, async () => {
      await supertest(app)
        .post(`/api/posts`)
        .field(`scale`, 77)
        .field(`effect`, `chrome`)
        .attach(`filename`, `test/img/2049.jpg`)
        .set(`Accept`, `image/jpeg`)
        .set(`Content-Type`, `multipart/form-data`)
        .expect(200)
        .expect(`Content-Type`, /image/);

    });
    it(`POST /api/posts/ without require params`, async () => {
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
