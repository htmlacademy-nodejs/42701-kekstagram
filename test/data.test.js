const {generateEntity, effects, convertDaysToMilliseconds} = require(`../generate`);
const assert = require(`assert`);

const data = generateEntity();

describe(`Data`, () => {
  describe(`Check data.url`, () => {
    it(`is string`, () => {
      assert.equal(typeof data.url, `string`);
    });
  });

  describe(`Check data.scale`, () => {
    it(`is number`, () => {
      assert.equal(typeof data.scale, `number`);
    });
    it(`is in range 0 - 100`, () => {
      assert.equal(data.scale >= 0 && data.scale <= 100, true);
    });
  });

  describe(`check data.effect`, () => {
    it(`is string`, () => {
      assert.equal(typeof data.effect, `string`);
    });
    it(`is in effects array`, () => {
      assert.equal(effects.includes(data.effect), true);
    });
  });

  describe(`check data.description`, () => {
    it(`is string`, () => {
      assert.equal(typeof data.description, `string`);
    });
    it(`description of the correct length`, () => {
      assert.equal(data.description.length < 140, true);
    });
  });

  describe(`check data.likes`, () => {
    it(`is number`, () => {
      assert.equal(typeof data.likes, `number`);
    });
    it(`is in range 0 - 1000`, () => {
      assert.equal(data.likes >= 0 && data.scale <= 1000, true);
    });
  });

  describe(`check data.comments`, () => {
    it(`is array`, () => {
      assert.equal(Array.isArray(data.comments), true);
    });
    it(`first item is string`, () => {
      assert.equal(typeof data.comments[0], `string`);
    });
    it(`first item of the correct length`, () => {
      assert.equal(data.comments[0].length < 140, true);
    });
  });

  describe(`check data.date`, () => {
    it(`is number`, () => {
      assert.equal(typeof data.date, `number`);
    });
    it(`is in correct range`, () => {
      const now = Date.now();
      assert.equal(data.date <= now && data.date >= now - convertDaysToMilliseconds(7), true);
    });
  });
});

