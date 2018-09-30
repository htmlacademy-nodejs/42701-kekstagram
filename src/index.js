const commands = {
  author: require(`./author`),
  license: require(`./license`),
  description: require(`./description`),
  version: require(`./version`),
  help: require(`./help`),
};

const {help} = commands;
help.execute = help.execute.bind(help, commands);

const exec = (params) => {
  let isError = false;

  params.forEach((param) => {
    const formatParam = param.slice(2);

    if (commands.hasOwnProperty(formatParam)) {
      commands[formatParam].execute();
    } else {
      console.error(`Неизвестная команда ${param}`);
      isError = true;
    }
  });

  if (isError) {
    help.execute(`error`);
  }
};

module.exports = {
  exec,
  commands,
};
