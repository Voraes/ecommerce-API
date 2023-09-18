//Express
const express = require('express');
const app = express();

//Imports
require('dotenv').config();
require('express-async-errors');
const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const morgan = require('morgan');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

//Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser(process.env.JWT_SECRET));

//Routes
app.use('/api/v1/auth', authRouter);

//Error Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port);
  } catch (error) {
    console.log(error);
  }
};

start();
