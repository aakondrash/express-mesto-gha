const router = require('express').Router();

const auth = require('../middlewares/auth');
const celebrates = require('../middlewares/celebrate');

const { createUser, login } = require('../controllers/users');

const users = require('./users');
const cards = require('./cards');

router.post('/signin', celebrates.loginVerification, login);
router.post('/signup', celebrates.loginVerification, createUser);
router.use('/users', auth, users);
router.use('/cards', auth, cards);

module.exports = router;