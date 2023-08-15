const router = require('express').Router();
const {
  createCard,
  deleteCard,
  getAllCards,
  setCardLike,
  removeCardLike,
} = require('../controllers/cards');
const { celebrate, Joi } = require('celebrate');
const { URL_REGEXP_PATTERN } = require('../utils/constants');


router.get('/cards', getAllCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(URL_REGEXP_PATTERN),
  }),
}), createCard);
router.delete('/cards/:_id', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);
router.put('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), setCardLike);
router.delete('/cards/:_id/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), removeCardLike);

module.exports = router;