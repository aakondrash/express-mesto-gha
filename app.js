const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');

const serverErrorHandler = require('./middlewares/serverErrorHandler');
const NotFoundError = require('./error_templates/NotFoundError');
const { auth } = require('./middlewares/auth');

const { URL_REGEXP_PATTERN } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const users = require('./routes/users');
const cards = require('./routes/cards');

const { createUser, login } = require('./controllers/users');

const { mestodbUrl = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(mestodbUrl);

app.use(helmet());

app.use(
  express.urlencoded({ extended: true, })
);

app.use(express.json());

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(URL_REGEXP_PATTERN),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(auth);

app.use('/', users);
app.use('/', cards);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует.'));
});

app.use(serverErrorHandler);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});