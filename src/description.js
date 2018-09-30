const {description} = require(`../package`);
const colors = require(`colors/safe`);

module.exports = {
  name: `description`,
  description: `Печатает описание проекта`,
  execute() {
    console.log(colors.rainbow(description));
  }
};
