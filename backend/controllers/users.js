const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/validation-err');
const AuthDataError = require('../errors/auth-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const { statusCode } = require('../utils/errors');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const mongoUpdateConfig = { new: true, runValidators: true };

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(statusCode.OK).send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.status(statusCode.OK).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      next(new NotFoundError('Пользователь c таким id не найден.'));
      return;
    }
    res.status(statusCode.OK).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(statusCode.OK).send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new AuthDataError('Неправильная почта или пароль'));
      return;
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      next(new AuthDataError('Неправильная почта или пароль'));
      return;
    }
    const token = await jwt.sign(
      { _id: user._id },
      // eslint-disable-next-line no-undef
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res.status(statusCode.OK)
      .cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
      .send({ message: 'Токен сохранен в куки' });
  } catch (err) {
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      mongoUpdateConfig,
    );
    res.status(statusCode.OK).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      mongoUpdateConfig,
    );
    res.status(statusCode.OK).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    res.status(statusCode.OK)
      .cookie('token', '', {
        maxAge: 0,
        httpOnly: true,
      })
      .send({ message: 'Вы разлогинились' });
  } catch (err) {
    next(err);
  }
};
