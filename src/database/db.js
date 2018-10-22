const {MongoClient} = require(`mongodb`);
const {name} = require(`../../package`);

const url = `mongodb://localhost:27017/`;

module.exports = MongoClient.connect(url, {useNewUrlParser: true})
  .then((client) => client.db(name))
  .catch((err) => {
    console.error(`Failed to connect BD`, err);
    process.exit(1);
  });
