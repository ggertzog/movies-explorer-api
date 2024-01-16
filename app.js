require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { signinValidate, signupValidate } = require('./middlewares/requestValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { centralErrorHandler } = require('./middlewares/centralErrorHandler');
const { DEV_DB_ADDRESS } = require('./utils/config');

const { PORT = 3000, DB_ADDRESS, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : DEV_DB_ADDRESS);

const app = express();

app.use(cors());

app.use(express.json());

app.use(helmet());

app.use(requestLogger);

app.post('/signin', signinValidate, login);
app.post('/signup', signupValidate, createUser);

app.use(auth);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(centralErrorHandler);

app.listen(PORT);