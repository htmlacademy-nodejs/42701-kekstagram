const {exec} = require(`./src/args/index`);
const {Readline} = require(`./src/readline`);

const [,, ...params] = process.argv;

if (params.length) {
  exec(params);
} else {
  const readline = new Readline();
  readline.greeting();
}
