const mainRouter = require('express').Router();
const auth = require('../middlewares/auth');

const usersRouter = require('./users');
const articlesRouter = require('./article');

mainRouter.use('/', usersRouter);
mainRouter.use('/', auth, articlesRouter);

module.exports = mainRouter;
