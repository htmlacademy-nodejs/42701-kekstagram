const author = require(`./author`);
const license = require(`./license`);
const description = require(`./description`);
const version = require(`./version`);
const help = require(`./help`);

const commands = {
  author,
  license,
  description,
  version,
  help,
};

const exec = (params) => {
  let countErrors = 0;

  params.forEach((param) => {
    const formatParam = param.slice(2);

    if (commands.hasOwnProperty(formatParam)) {
      commands[formatParam].execute(commands);
    } else {
      console.error(`Неизвестная команда ${param}`);
      countErrors++;
    }
  });

  if (countErrors) {
    commands.help.execute(commands, `error`);
  }
};

module.exports = {
  exec,
  commands,
};
