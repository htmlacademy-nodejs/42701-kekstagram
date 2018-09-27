const {paramList} = require(`./data`);

const {log, error} = console;
const [,, ...params] = process.argv;

const paramsHandler = (list) => {
  if (!list.length) {
    list.forEach((paramName) => {
      if (paramList.hasOwnProperty(paramName)) {
        log(paramList[paramName]);
      } else {
        error(paramList.error(paramName));
      }
    });
  } else {
    log(paramList.default);
  }
};

paramsHandler(params);
