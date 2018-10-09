const {findFile, writeFile, unlink} = require(`../src/readline`).Readline;
const assert = require(`assert`);
const path = require(`path`);

const indexFile = path.resolve(__dirname, `../index.js`);
const testFile = path.resolve(__dirname, `./_test.js`);

describe(`File system`, () => {
  describe(`Stat file`, () => {
    it(`Check availability index.js`, () => {
      assert.equal(findFile(indexFile), true);
    });
  });
  describe(`Write file`, () => {
    it(`File _test.js is not created`, () => {
      assert.equal(findFile(testFile), false);
    });
    it(`File _test.js created`, () => {
      writeFile(testFile);
      assert.equal(findFile(testFile), true);
    });
    it(`File _test.js deleted`, () => {
      unlink(testFile);
      assert.equal(findFile(testFile), false);
    });
  });
});
