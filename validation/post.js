const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if(!Validator.isLength(data.text, { min: 10, max: 300})) {
    errors.text = 'comment must be 10-300 chars';
  }

  if(Validator.isEmpty(data.text)) {
    errors.text = 'body is req'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
