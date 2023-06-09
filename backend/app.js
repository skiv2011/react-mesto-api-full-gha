/* eslint-disable eol-last */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
const { limiter } = require('./middlewares/limiter');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');
const { auth } = require('./middlewares/auth');
const { regexURL } = require('./utils/constants');
const { errorHandler } = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
mongoose.set('strictQuery', true);

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://firemandzen.nomoredomains.monster',
    'https://firemandzen.nomoredomains.monster',
],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
};

app.use('*', cors(options));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(limiter);


app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());
app.use(errorHandler);

mongoose
  .connect('mongodb://127.0.0.1/mestodb')
  .then(() => console.log('Успешное подключение к MongoDB'))
  .catch((err) => console.error('Ошибка подключения:', err));

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});