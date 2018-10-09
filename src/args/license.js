const {license} = require(`../../package`);

module.exports = {
  name: `license`,
  description: `Печатает лицензию`,
  execute() {
    console.log(license);
  }
};
