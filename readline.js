const readline = require(`readline`);
const {generateData} = require(`./generate`);
const fs = require(`fs`);
const util = require(`util`);
const stat = util.promisify(fs.stat);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

class Readline {
  constructor(params) {
    this.data = null;

    this.rl = readline.createInterface(Object.assign({
      input: process.stdin,
      output: process.stdout,
    }), params);

    this.rl
      .on(`close`, () => {
        console.log(`Don't come back here!`);
        process.exit(0);
      })
      .on(`error`, (err) => {
        console.log(err);
        process.exit(1);
      });
  }

  greeting() {
    this.rl.question(`YO, do you need data? (Y/N) `, (answer) => {
      answer = answer.toLowerCase();
      switch (answer) {
        case `n`:
          this.rl.emit(`close`);
          break;

        case `y`:
          this.getValue();
          break;

        default:
          this.greeting();
      }
    });
  }

  getValue() {
    this.rl.question(`How many elements you need? `, (answer) => {
      answer = parseInt(answer, 10);

      if (answer) {
        this.data = generateData(answer);
        this.getPath();
      } else {
        console.log(`Value must be a number`);
        this.getValue();
      }
    });
  }

  getPath() {
    this.rl.question(`Where to put this shit? `, async (path) => {
      const isCreated = await Readline.checkPath(path);

      if (isCreated) {
        this.replaceFile(path);
      } else {
        await Readline.writeFile(path, this.data);
        this.rl.close();
      }
    });
  }

  replaceFile(path) {
    this.rl.question(`File already created, replace it? (Y/N) `, async (answer) => {
      answer = answer.toLowerCase();
      switch (answer) {
        case `y`:
          await Readline.writeFile(path);
          this.rl.close();
          break;

        case `n`:
          this.getPath();
          break;

        default:
          this.replaceFile(path);
      }
    });
  }

  static async checkPath(path) {
    console.log(path);
    try {
      await stat(path);
      return true;
    } catch (err) {
      if (err.code === `ENOENT`) {
        return false;
      } else {
        console.error(err);
      }
    }

    return false;
  }

  static async writeFile(path, data) {
    await writeFile(path, JSON.stringify(data));
    console.log(`File was created!`);
  }

  static async unlink(path) {
    await unlink(path);
    console.log(`File was deleted!`);
  }
}


module.exports = {
  Readline,
};
