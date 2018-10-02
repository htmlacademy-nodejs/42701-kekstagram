const effects = [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`];
const hashtags = [`cyberpunk`, `scifi`, `trailer`, `alteredcarbon`, `future`, `bladerunner`, `carbon`, `story`, `witcher`, `neon`, `time`, `robots`];
const description = `A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.`;

const convertDaysToMilliseconds = (days) => days * 24 * 60 * 60 * 1000;
const randomSort = () => Math.random() - 0.5;

const getRandomNumberInRange = (from, to) => Math.floor(from + Math.random() * (to - from + 1));
const getRandomArrayEl = (array) => array[getRandomNumberInRange(0, array.length)];
const getRandomArray = (array, max) => array.sort(randomSort).slice(0, getRandomNumberInRange(1, max)).map((item) => `#${item}`);
const getRandomString = (desc) => desc.split(` `).sort(randomSort).join(` `);
const getRandomArrayOfString = (desc, max) => new Array(getRandomNumberInRange(1, max)).fill(``).map(() => getRandomString(desc));
const getRandomDate = (now, max) => getRandomNumberInRange(now - convertDaysToMilliseconds(max), now);

const generateEntity = () => ({
  url: `https://picsum.photos/600/?random`,
  scale: getRandomNumberInRange(0, 100),
  effect: getRandomArrayEl(effects),
  hashtags: getRandomArray(hashtags, 5),
  description: getRandomString(description),
  likes: getRandomNumberInRange(0, 1000),
  comments: getRandomArrayOfString(description, 10),
  date: getRandomDate(Date.now(), 7),
});

module.exports = {
  data: generateEntity(),
  effects,
  convertDaysToMilliseconds
};
