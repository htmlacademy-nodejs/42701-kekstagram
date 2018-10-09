const commands = {
  author: require(`./author`),
  license: require(`./license`),
  description: require(`./description`),
  version: require(`./version`),
  help: require(`./help`),
  server: require(`./server`),
};

const {help} = commands;
help.execute = help.execute.bind(help, commands);

const exec = (params) => {
  let isError = false;

  params.forEach((param) => {
    const formatParam = param.slice(2);
    const [paramName, paramValue] = formatParam.split(`=`);

    if (commands.hasOwnProperty(paramName)) {
      commands[paramName].execute(paramValue);
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
