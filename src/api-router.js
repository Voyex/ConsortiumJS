const express = require('express');
const router = express.Router();

const loginRoute = require('./routes/login.route');
const signupRoute = require('./routes/signup.route');

router.use('/login', loginRoute);
router.use('/signup', signupRoute);

module.exports = router;