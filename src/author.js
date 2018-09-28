const {author} = require(`../package`);

module.exports = {
  name: `author`,
  description: `Печатает имя автора`,
  execute() {
    console.log(author);
  }
};
