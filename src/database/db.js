const {MongoClient} = require(`mongodb`);
const {name} = require(`../../package`);
const logger = require(`../logger`);

const {
  DB_HOST = `localhost:27017`,
  // DB_USER,
  // DB_PASS,
} = process.env;

const url = `mongodb://${DB_HOST}/`;

module.exports = MongoClient.connect(url, {useNewUrlParser: true})
  .then((client) => client.db(name))
  .catch((err) => {
    logger.error(`Failed to connect BD`, err);
    process.exit(1);
  });
