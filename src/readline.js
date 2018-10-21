const readline = require(`readline`);
const {generateData} = require(`../test/mock/generate`);
const fs = require(`fs`);

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
          this.rl.close();
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
    this.rl.question(`Where to put this shit? `, (path) => {
      const fileIsFound = Readline.findFile(path);

      if (fileIsFound) {
        this.replaceFile(path);
      } else {
        Readline.writeFile(path, this.data);
        this.rl.close();
      }
    });
  }

  replaceFile(path) {
    this.rl.question(`File already created, replace it? (Y/N) `, (answer) => {
      answer = answer.toLowerCase();
      switch (answer) {
        case `y`:
          Readline.writeFile(path);
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

  static findFile(path) {
    try {
      fs.statSync(path);
    } catch (err) {
      if (err.code === `ENOENT`) {
        return false;
      }
    }

    return true;
  }

  static writeFile(path, data) {
    fs.writeFileSync(path, JSON.stringify(data));
    console.log(`File was created!`);
  }

  static unlink(path) {
    fs.unlinkSync(path);
    console.log(`File was deleted!`);
  }
}


module.exports = {
  Readline,
};
