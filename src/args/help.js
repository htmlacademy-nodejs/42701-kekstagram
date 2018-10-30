const {gray, green} = require(`colors/safe`);

const getPhrase = ({name, description}) => ` --${gray(name)} — ${green(description)}`;
const getCommandsList = (list) => list.map(getPhrase).join(`\n`);

module.exports = {
  name: `help`,
  description: `Печатает доступные команды`,
  execute(commands, type = `log`) {
    console[type](`Доступные команды: \n${getCommandsList(commands)}`);
  }
};
