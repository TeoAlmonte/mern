const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys');
const passport = require('passport')

const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

const User = require('../../models/User')

// @route GET api/users/test
// @desc Tests post route
// @access Public
router.get('/test', (req, res) => res.json({ msg: `Working` }))

// @route  Post api/users/register
// @desc   Register a user
// @access Public
router.post('/register', (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body)
  if(!isValid) {
    return res.status(400).json(errors)
  }

  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: 'email taken'
        })
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        })
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                res.json(user);
              })
              .catch(err => {
                console.log(err);
              });
          });
        });
      }
    })
});

// @route  Post api/users/login
// @desc   Login a User and return the JWT Token
// @access Public
router.post('/login', (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body)
  if(!isValid) {
    return res.status(400).json(errors)
  }


  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
    .then(user => {
      if(!user) {
        return res.status(404).json({email: 'user not found'})
      }
      bcrypt.compare(password, user.password)
      .then(isMatch => {
        if(isMatch) {
          const payload = { id: user.id, name: user.name, avatar: user.avatar }
          jwt.sign(
            payload,
            keys.secret,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            })
        } else {
          return res.status(400).json({password: 'Password incorrect'})
        }
      })
    })
})

// @route  Get api/users/user
// @desc   Return logged in user
// @access Private
router.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})

module.exports = router;