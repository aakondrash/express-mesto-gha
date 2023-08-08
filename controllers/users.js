const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({
        name,
        about,
        avatar
      })
      .then((user) => {
        res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') return res.status(400).send({message: "Переданы некорректные данные при создании пользователя."})
        return res.status(500).send({message: "Ошибка по умолчанию."})
      });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
      .then((user) => {
        res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') return res.status(400).send({message: "Переданы некорректные данные при создании пользователя."})
        return res.status(500).send({message: "Ошибка по умолчанию."})
      });
};

module.exports.getUserInfo = (req, res) => {
  User.findById(req.user._id)
      .then((user) => {
        res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'NotFoundError') return res.status(404).send({message: "Пользователь по указанному _id не найден."})
        return res.status(500).send({message: "Ошибка по умолчанию."})
      });
};


module.exports.setAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        { new: true }
      )
      .then((user) => {
        res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'NotFoundError') return res.status(404).send({message: "Пользователь по указанному _id не найден."})
        if (err.name === 'ValidationError') return res.status(400).send({message: "Переданы некорректные данные при обновлении профиля."})
        return res.status(500).send({message: "Ошибка по умолчанию."})
      });
};

module.exports.setProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        { new: true }
      )
      .then((user) => {
        res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'NotFoundError') return res.status(404).send({message: "Пользователь по указанному _id не найден."})
        if (err.name === 'ValidationError') return res.status(400).send({message: "Переданы некорректные данные при обновлении профиля."})
        return res.status(500).send({message: "Ошибка по умолчанию."})
      });
};

