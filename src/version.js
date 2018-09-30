const {version} = require(`../package`);
const colors = require(`colors/safe`);

const colorsList = [
  `red`, // major
  `green`, // minor
  `blue`, // patch
];

const colorize = (string) =>
  string
    .split(`.`)
    .map((value, i) => colors[colorsList[i]](value))
    .join(`.`);

module.exports = {
  name: `version`,
  description: `Печатает версию приложения`,
  execute() {
    console.log(`v${colorize(version)}`);
  }
};
