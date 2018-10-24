const db = require(`../database/db`);
const logger = require(`../logger`);

const setupPosts = async () => (await db).collection(`posts`);

class PostsStore {
  constructor(collection) {
    this.collection = collection;
  }


  async getPost(date) {
    return (await this.collection).findOne({date});
  }

  get allPosts() {
    return (async () => (await this.collection).find())();
  }

  async save(data) {
    return (await this.collection).insertOne(data);
  }

}

module.exports = new PostsStore(setupPosts()
  .catch((err) => logger.error(`Field to setup collections 'posts'`, err)));
