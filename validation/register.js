const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.passwordconfirm = !isEmpty(data.passwordconfirm) ? data.passwordconfirm : '';

  if(!Validator.isLength(data.name, { min: 2, max: 30})) {
    errors.name = 'Name must be 2-30 chars';
  }

  if(Validator.isEmpty(data.name)) {
    errors.name = 'name is req'
  }

  if(Validator.isEmpty(data.email)) {
    errors.email = 'email is req'
  }

  if(!Validator.isEmail(data.email)) {
    errors.email = 'email is invalid'
  }

  if(Validator.isEmpty(data.password)) {
    errors.password = 'pass is req'
  }

  if(!Validator.isLength(data.password, {min: 6, max: 30})) {
    errors.password = 'pass is min 6 max 30'
  }

  if(Validator.isEmpty(data.passwordconfirm)) {
    errors.passwordconfirm = 'pass con is req'
  }

  if(!Validator.equals(data.password, data.passwordconfirm)) {
    errors.passwordconfirm = 'pass must match'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }

}