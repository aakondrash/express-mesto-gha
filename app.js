const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const serverErrorHandler = require('./middlewares/serverErrorHandler');
const NotFoundError = require('./error_templates/NotFoundError');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const users = require('./routes/users');
const cards = require('./routes/cards');

const signup = require('./routes/signup');
const signin = require('./routes/signin');

const { mestodbUrl = "mongodb://127.0.0.1:27017/mestodb" } = process.env;
mongoose.connect(mestodbUrl);

const app = express();

app.use(
  express.urlencoded({ extended: true })
);
app.use(express.json());

app.use('/', signup);
app.use('/', signin);

app.use('/', auth, users);
app.use('/', auth, cards);

app.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует.'));
});

app.use(serverErrorHandler);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});