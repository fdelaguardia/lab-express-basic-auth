var express = require('express');
var router = express.Router();

const User = require('../models/User.model')

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

/* GET users listing. */
router.get('/', isLoggedOut, function(req, res, next) {
  res.render('login/user-login.hbs');
});

router.post(('/'), isLoggedOut, (req, res, next) => {
  

  const {username, password} = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        password: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      res.redirect('/login/user-real-login')
    })
    .catch(error => next(error));
})

router.get(('/user-real-login'), isLoggedOut, (req, res, next) => {
  res.render('login/user-real-login.hbs')
})


router.post('/user-real-login', isLoggedOut, (req, res, next) => {
  const { username, password } = req.body; 
  if( !username || !password ) {
    res.render('login/user-real-login.hbs', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({username})
    .then((user) => {
      if (!user) {
        res.render('login/user-real-login.hbs', { errorMessage: 'Username is not registered. Try with other.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.user = user
        console.log('SESSION =====> ', req.session);
        res.redirect('/login/user-profile');
      } else {
        res.render('login/user-real-login.hbs', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch((err) => {
      console.log(err)
    })

})

router.get(('/user-profile'), isLoggedIn, (req, res, next) => {
  const user = req.session.user
  res.render("login/user-profile.hbs", {user})
})


module.exports = router;
