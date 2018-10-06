const {exec} = require(`./src`);
const {Readline} = require(`./readline`);

const [,, ...params] = process.argv;

if (params.length) {
  exec(params);
} else {
  const readline = new Readline();
  readline.greeting();
}
