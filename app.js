const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const serverErrorHandler = require('./middlewares/serverErrorHandler');
const NotFoundError = require('./error_templates/NotFoundError');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { mestodbUrl = "mongodb://127.0.0.1:27017/mestodb" } = process.env;
mongoose.connect(mestodbUrl);

const app = express();

app.use(
  express.urlencoded({ extended: true })
);
app.use(express.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64d237d698d9214f97efb9b0' // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });

app.use(auth);

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', users);
app.use('/', cards);

app.use(serverErrorHandler);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует.'));
});


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})