'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

const countConnect = () => {
    const numberConnection = mongoose.connections.length;
    console.log(`Number connection::${numberConnection}`);
}

const checkOverload = () => {
    setInterval( () => {
        const numberConnection = mongoose.connections.length;
        const numberCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        //Example maximum number of connection based on number of core
        const maxConnections = numberCore * 5;

        console.log(`Memory usage::: ${memoryUsage /1024 / 1024 } MB`);
        if (numberConnection > maxConnections) {
            console.log(`Connection overload detected`);
            //notify.send()....
        }
        
    },_SECONDS);
}

module.exports = {
    countConnect,
    checkOverload
}