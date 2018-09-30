const commands = {
  author: require(`./author`),
  license: require(`./license`),
  description: require(`./description`),
  version: require(`./version`),
  help: require(`./help`),
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
