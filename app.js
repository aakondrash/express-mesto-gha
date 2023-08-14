const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const serverErrorHandler = require('./middlewares/serverErrorHandler');
const NotFoundError = require('./error_templates/NotFoundError');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const routes = require('./routes/routes');
const { login, createUser } = require('./controllers/users');

const { mestodbUrl = "mongodb://127.0.0.1:27017/mestodb" } = process.env;
mongoose.connect(mestodbUrl);

const app = express();

app.use(
  express.urlencoded({ extended: true })
);
app.use(express.json());

app.use(routes);

app.use(serverErrorHandler);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует.'));
});


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})