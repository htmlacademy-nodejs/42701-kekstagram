const {exec} = require(`./src`);
const [,, ...params] = process.argv;

exec(params);
