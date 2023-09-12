require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
// const { checkOverload } = require('./helper/check.connnect');

const app = express();

//init middleware
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());

//init db
require('./dbs/init.mongodb');
// checkOverload();
//init router

app.get('/', (req, res, next) => {
    const strCompress = "Xin chao!";
    return res.status(200).json({
        message: "Well come nodejs!",
        metaData: strCompress.repeat(10000),
    })
})

//handling error

module.exports = app;