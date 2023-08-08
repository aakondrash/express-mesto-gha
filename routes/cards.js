const router = require('express').Router();
const {
  createCard,
  deleteCard,
  getAllCards,
  setCardLike,
  removeCardLike,
} = require('../controllers/cards');

router.get('/cards', getAllCards);
router.post('/cards', createCard);
router.delete('/cards/:_id', deleteCard);
router.put('/cards/:_id/likes', setCardLike);
router.delete('/cards/:_id/likes', removeCardLike);

module.exports = router;