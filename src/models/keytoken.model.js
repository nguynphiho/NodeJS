'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'Keys';
const DOCUMENT_NAME = 'Key';

// Declare the Schema of the Mongo model
var keytokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required:true,
        unique:true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: Array,
        default: [],
        require: true,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, keytokenSchema);