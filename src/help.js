const getList = (list) => {
  let commandsList = [];

  for (let item in list) {
    if (list.hasOwnProperty(item)) {
      commandsList.push(`\n--${list[item].name} — ${list[item].description}`);
    }
  }

  return commandsList.join(``);
};

module.exports = {
  name: `help`,
  description: `Печатает доступные команды`,
  execute(commands, type = `log`) {

    console[type](`Доступные команды: ${getList(commands)}`);
  }
};
