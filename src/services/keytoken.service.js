'use strict'

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const publicKeyString = publicKey.toString();
            const privateKeyString = privateKey.toString();
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString,
                privateKey: privateKeyString
            })

            return tokens ? tokens.publicKey : null;
        } catch(error) {
            return error;
        }
    }
}

module.exports = KeyTokenService;