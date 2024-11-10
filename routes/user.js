const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRediretUrl } = require("../views/middleware.js");
const { getSignUp, addUser, getLogin, login, logoutFun } = require("../controller/user.js");


router.route('/signup').get(getSignUp).post(wrapAsync(addUser))
router.route('/login').get(getLogin).post( saveRediretUrl, passport.authenticate('local', { 
  failureRedirect: '/login', 
  failureFlash: true 
}), login);


router.get('/logout',logoutFun)

module.exports = router;