const {version} = require(`../package`);

module.exports = {
  name: `version`,
  description: `Печатает версию приложения`,
  execute() {
    console.log(`v${version}`);
  }
};
