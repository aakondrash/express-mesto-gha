const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const { PORT = 3000 } = process.env;

const users = require('./routes/users');
const cards = require('./routes/cards');

const mestodbUrl = "mongodb://127.0.0.1:27017/mestodb"
mongoose.connect(mestodbUrl);

const app = express();

app.use(
  express.urlencoded({ extended: true })
);
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64d237d698d9214f97efb9b0' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', users);
app.use('/', cards);

app.use((req, res, next) => res.status(404).send({message: "Такой страницы не существует"}));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})