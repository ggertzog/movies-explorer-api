const IncorrectError = require('./IncorrectError');
const NotFoundError = require('./NotFoundError');
const AccessError = require('./AccessError');
const DuplicateEmailError = require('./DuplicateEmailError');
const UnauthorizedError = require('./UnauthorizedError');

module.exports = {
  IncorrectError,
  NotFoundError,
  AccessError,
  DuplicateEmailError,
  UnauthorizedError
}