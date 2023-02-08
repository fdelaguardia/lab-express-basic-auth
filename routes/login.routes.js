var express = require('express');
var router = express.Router();

const User = require('../models/User.model')

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login/user-login.hbs');
});

router.post(('/'), (req, res, next) => {
  

  const {username, password} = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        // username: username
        username,
        password: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.send('Login Successful')
    })
    .catch(error => next(error));

    
  //res.redirect('/users/profile')
})


module.exports = router;
