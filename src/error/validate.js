class ValidateError extends Error {
  constructor(errors) {
    super(`Data validation error`);
    this.code = 400;
    this.errors = errors;
    console.log(errors);
  }
}

module.exports = ValidateError;
