'use strict'

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            };
            const options = { upsert: true, new: true };

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        } catch(error) {
            return error;
        }
    }

    static findByUserId = async (userId) => {
        return keytokenModel.findOne({ user: new Types.ObjectId(userId)})
    }

    static removeKeyById = async (id) => {
        return keytokenModel.deleteOne(id);
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return keytokenModel.findOne({ refreshToken })
    }

    static deleteKeyById = async (userId) => {
        return keytokenModel.deleteOne({ user: new Types.ObjectId(userId) })
    }
}

module.exports = KeyTokenService;