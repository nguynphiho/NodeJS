'use strict'

const mongoose = require('mongoose');
const { countConnect } = require('../helper/check.connnect');
const { db: { host, name, port }} = require('../configs/config.mongodb'); 
const connectString = `mongodb://${host}:${port}/${name}`

class Database {
    constructor() {
        this.connect();
    }

    connect( type = "mongodb" ) {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50,
        })
        .then( _ => {
            console.log(`Connected Mongodb Successfully!`);
            countConnect();
        })
        .catch( error => console.log("Error connect:::", error))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;