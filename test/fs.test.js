const {checkPath, writeFile, unlink} = require(`../readline`).Readline;
const assert = require(`assert`);
const path = require(`path`);

const indexFile = path.resolve(__dirname, `../index.js`);
const testFile = path.resolve(__dirname, `./_test.js`);

describe(`File system`, () => {
  describe(`Stat file`, () => {
    it(`Check availability index.js`, async () => {
      assert.equal(await checkPath(indexFile), true);
    });
  });
  describe(`Write file`, () => {
    it(`File _test.js is not created`, async () => {
      assert.equal(await checkPath(testFile), false);
    });
    it(`File _test.js created`, async () => {
      await writeFile(testFile);
      assert.equal(await checkPath(testFile), true);
    });
    it(`File _test.js deleted`, async () => {
      await unlink(testFile);
      assert.equal(await checkPath(testFile), false);
    });
  });
});
