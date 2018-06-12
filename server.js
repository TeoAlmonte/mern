const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = require('./config/keys').mongoURI;

mongoose
  .connect(db)
  .then(() => console.log('connected'))
  .catch(err => console.log(err))

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`))