const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.field = !isEmpty(data.field) ? data.field : '';
  data.from = !isEmpty(data.from) ? data.from : '';


  if(Validator.isEmpty(data.school)) {
    errors.school = 'school is req'
  }

  if(Validator.isEmpty(data.degree)) {
    errors.degree = 'degree is req'
  }

  if(Validator.isEmpty(data.field)) {
    errors.field = 'field is req'
  }

  if(Validator.isEmpty(data.from)) {
    errors.from = 'from is req'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
