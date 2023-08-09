const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
      .then((card) => {
        res.status(200).send({ data: card });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') return res.status(400).send({message: " Переданы некорректные данные при создании карточки."})
        return res.status(500).send({message: "Ошибка по умолчанию."})
      });
};

module.exports.deleteCard = (req, res) => {
  Card.findOne({ _id: req.params._id })
      .orFail(() => {
        return res.status(404).send({message: "Карточка с указанным _id не найдена."});
      })
      .then((card) => {
          Card.deleteOne(card).then(() =>
            res.status(200).send({ data: card })
          );
      })
      .catch((err) => {
        if (err.name === 'NotFoundError') return res.status(404).send({message: "Карточка с указанным _id не найдена."})
        if (err.name === 'ValidationError' || req.params._id.length != 24) return res.status(400).send({message: "Переданы некорректные данные при создании карточки."})
        return res.status(500).send({message: "Ошибка по умолчанию."})
      });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
      .populate(['owner', 'likes'])
      .then((card) => {
        res.status(200).send({ data: card });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') return res.status(400).send({message: " Переданы некорректные данные при создании карточки."})
        return res.status(500).send({message: "Ошибка по умолчанию."})
      });
};

module.exports.setCardLike = (req, res) => {
  Card.findByIdAndUpdate(
        req.params._id,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      )
      .then((card) => {
        if (!card) return res.status(404).send({message: "Передан несуществующий _id карточки."})
        res.status(200).send({ data: card });
      })
      .catch((err) => {
        if (err.name === 'NotFoundError') return res.status(404).send({message: "Передан несуществующий _id карточки."})
        if (err.name === 'ValidationError') return res.status(400).send({message: "Переданы некорректные данные для постановки/снятии лайка."})
        return res.status(500).send({message: "Ошибка по умолчанию."})
      });
};

module.exports.removeCardLike = (req, res) => {
  Card.findByIdAndUpdate(
        req.params._id,
        { $pull: { likes: req.user._id } },
        { new: true }
      )
      .then((card) => {
        if (!card) return res.status(404).send({message: "Передан несуществующий _id карточки."})
        res.status(200).send(card);
      })
      .catch((err) => {
        if (err.name === 'NotFoundError') return res.status(404).send({message: "Передан несуществующий _id карточки."})
        if (err.name === 'ValidationError') return res.status(400).send({message: "Переданы некорректные данные для постановки/снятии лайка."})
        return res.status(500).send({message: "Ошибка по умолчанию."})
      });
};