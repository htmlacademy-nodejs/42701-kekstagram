const server = require(`../server`);

module.exports = {
  name: `server`,
  description: `Запускает сервер на указанном порту, по-умолчанию 3000`,
  execute(port) {
    server.start(port);
  }
};
