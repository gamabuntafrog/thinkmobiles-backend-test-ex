const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv')
const cors = require('cors')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors())
dotenv.config()

const mongoose = require('mongoose');

async function connectMongoose() {
   try {
       await mongoose.connect(process.env.DB_HOST)

       console.log('Mongoose connected')
   } catch (e) {
       console.log(`Mongoose error: ${e.message}`)

       process.exit(1)
   }
}

connectMongoose()
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err)

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500).json({
        message: err.message,
    });
});

module.exports = app;
