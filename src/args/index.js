const commands = [
  require(`./help`),
  require(`./author`),
  require(`./license`),
  require(`./description`),
  require(`./version`),
  require(`./server`),
];

const help = commands[0];
help.execute = help.execute.bind(help, commands);

const exec = (params) => {
  let isError = false;

  params.forEach((param) => {
    const formatParam = param.slice(2);
    const [paramName, paramValue] = formatParam.split(`=`);

    const command = commands.find((item) => item.name === paramName);
    if (command) {
      command.execute(paramValue);
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
