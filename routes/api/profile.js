const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/profile/test
// @desc Tests post route
// @access Public
router.get('/test', (req, res) => res.json({ msg: `Working` }))

// @route GET api/profile/
// @desc  Get user profile
// @access Private
router.get('/', passport.authenticate('jwt', { session:false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if(!profile) {
        return res.status(404).json({
          msg: 'There is no profile for this user'
        });
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// @route POST api/profile/
// @desc  Create user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session:false }), (req, res) => {

  const profileFields = {};
  profileFields.user = req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.handle) profileFields.handle = req.body.handle;

})

module.exports = router;