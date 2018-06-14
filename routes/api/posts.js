const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport')

const validatePostInput = require('../../validation/post')

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get('/test', (req, res) => res.json({ msg: `Working` }))

// @route  GET api/posts/all
// @desc   Get all posts
// @access Public
router.get('/all', (req, res) => {
  Post.find()
    .sort({date: -1})
    .then(posts => {
      res.json(posts)
    })
    .catch(err => res.status(404).json({noposts: 'no posts at all'}))
})

// @route  GET api/posts/:post_id
// @desc   Get single
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => {
      res.json(post)
    })
    .catch(err => res.status(404).json({nopost: 'No found with id'}))
})

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

// @route   DELETE api/posts/:id
// @desc    Delete Posts
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if(post.user.toString() !== req.user.id) {
            return res
            .status(401)
            .json({ notauth: 'User not auth'})
          }
          post.remove().then(() => res.json({success: true}))
        })
    .catch(err => res.status(404).json({postnotfound: 'not found'}));
    })
});

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
         if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
           return res.status(400).json({alreadyliked: 'User already liked this post'})
         }
         post.likes.unshift({user: req.user.id})
         post.save().then(post => res.json(post))
        })
    .catch(err => res.status(404).json({postnotfound: 'not found'}));
    })
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
         if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
           return res.status(400).json({notliked: 'you have not liked this yet'})
         }

         const removeIndex = post.likes
         .map(item => item.user.toString())
         .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);

          post.save().then(post => res.json(post));
        })
    .catch(err => res.status(404).json({postnotfound: 'not found'}));
    })
});

module.exports = router;