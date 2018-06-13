const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport')

const validatePostInput = require('../../validation/post')

const Post = require('../../models/Post');


// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get('/test', (req, res) => res.json({ msg: `Working` }))

// @route  POST api/posts
// @desc   Tests post route
// @access Public
router.post('/',  passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validatePostInput(req.body)
  if(!isValid) {
    return res.status(400).json(errors)
  }

  const newPost = new Post({
    body: req.body.body,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  })
  newPost.save()
    .then(post => {
      res.json(post)
    })
})


module.exports = router;