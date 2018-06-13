const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.body = !isEmpty(data.body) ? data.body : '';

  if(!Validator.isLength(data.body, { min: 10, max: 300})) {
    errors.body = 'comment must be 10-300 chars';
  }

  if(Validator.isEmpty(data.body)) {
    errors.body = 'body is req'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
