const {description} = require(`../package`);

module.exports = {
  name: `description`,
  description: `Печатает описание проекта`,
  execute() {
    console.log(description);
  }
};
