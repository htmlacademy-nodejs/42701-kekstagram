const { paramList } = require('./data');

const {log, error} = console;
const [,, ...params] = process.argv;

const paramsHandler = (params) => {
  if (!params.length) {
    return log(paramList.default);
  }

  params.forEach(paramName => {
    if (paramList.hasOwnProperty(paramName)) {
      log(paramList[paramName]);
    } else {
      error(paramList.error(paramName));
    }
  });
};

paramsHandler(params);
