const User = require('../models/user');
const bcrypt = require('bcrypt');
const ConflictError = require('../error_templates/ConflictError');
const BadRequestError = require('../error_templates/BadRequestError');
const NotFoundError = require('../error_templates/NotFoundError');
const UnauthorizedError = require('../error_templates/UnauthorizedError');

const CLIENT_SECRET = "куку";


module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
      .then(hash => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then((user) => {
        return res.status(201).send({ data: user });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictError('Передан e-mail адрес уже зарегистрированного пользователя.'));
        } else if (err.name === 'ValidationError') {
          return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        } else {
          return next(err);
        }
      });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
      .then((user) => {
        return res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        return next(err);
      });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.params.userId)
      .then((user) => {
        if (!user) return next(new NotFoundError('Пользователь по указанному _id не найден.'));
        return res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError' || err.name === 'CastError') return next(new BadRequestError('Переданы некорректные данные для получения данных пользователя.'));
        return next(err);
      });
};


module.exports.setAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        { new: true, runValidators: true }
      )
      .then((user) => {
        return res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'NotFoundError') return next(new NotFoundError('Пользователь по указанному _id не найден.'));
        if (err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
        return next(err);
      });
};

module.exports.setProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        { new: true, runValidators: true }
      )
      .then((user) => {
        return res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'NotFoundError') return next(new NotFoundError('Пользователь по указанному _id не найден.'));
        if (err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
        return next(err);
      });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((response) => {
      const {_id: userId} = response;
      if (userId) {
        const token = jwt.sign(
          {userId},
          CLIENT_SECRET,
          {expiresIn: '7d'},
        );
        return res.send({_id: token});
      }
    })
    .catch((err) => {
      if (err.name === 'UnauthorizedError') return next(UnauthorizedError('Переданы неверные данные при регистрации'));
      return next(err);
    });
}

