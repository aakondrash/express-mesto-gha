const router = require('express').Router();
const {
  createUser,
  getAllUsers,
  getUserInfo,
  setAvatar,
  setProfile
} = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/me', getUserInfo);
router.post('/users', createUser);
router.get('/users/:userId', getUserInfo);
router.patch('/users/me/avatar', setAvatar);
router.patch('/users/me', setProfile);

module.exports = router;