const express = require('express');
const bodyParser = require('body-parser').json();
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const mongoose = require('mongoose');

const { limiter } = require('./middlewares/limiter');
const { errorHandler } = require('./middlewares/errorHandler');
const mainRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NODE_ENV, DB_ADDRESS, devDbAddress } = require('./config');

const NotFoundError = require('./errors/notFoundError');

const { resourceNotFoundText } = require('./constants');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : devDbAddress);

app.use(cors());
app.options('*', cors());

app.use(helmet());
app.use(bodyParser);
app.use(requestLogger);
app.use(errors());

app.use(limiter);
app.use('/', mainRouter);
app.get('*', () => {
  throw new NotFoundError(resourceNotFoundText);
});

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT);
