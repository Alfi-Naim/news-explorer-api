const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getCurrentUser, login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

usersRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

usersRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

usersRouter.get('/users/me', auth, getCurrentUser);

module.exports = usersRouter;
