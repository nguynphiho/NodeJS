'use strict'

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require("../models/shop.model");
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const KeyTokenService = require('./keytoken.service');
const { getInforData } = require('../utils');
const { ConflictRequestError, BadRequestError, AuthFailureError, ForbiddenError} = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    /*
        Check token was used?
    */
    static handleRefreshTokenUsed = async (refreshToken) => {
        // Check if the token was used?
        const foundKeyToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

        // Yes
        if (foundKeyToken) {
            // Decode and identify the user
            const { userId, email } = await verifyJWT(refreshToken, foundKeyToken.publicKey)
            console.log({ userId, email })
            // Delete the key token
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError("Something went wrong, Please login again!")
        }

        // No
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError("Shop is not registered!")

        // Verify token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.publicKey)
        console.log("DEBUG handle refresh token", { userId, email })

        const foundShop = findByEmail(email)
        if (!foundShop) throw new AuthFailureError("Shop is not registered!")

        // Create new pair token
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        // Update token
        await holderToken.update({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // the token was used to get a new token.
            }
        })

        return {
            user : { userId, email },
            tokens
        }
    }

    static logout = async( keyStore ) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        return delKey;
    }

    /**
     * 1- check email trong dbs
     * 2- match password
     * 3- create AT and RT and save
     * 4- generate token
     * 5- get data return login
     */
    static login = async({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if ( !foundShop ) throw new BadRequestError('Shop not registered');
        
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError('Authentication Error');

        const { privateKey, publicKey } = this.keyGen();
        
        const tokens = await createTokenPair({ userId: foundShop._id, email}, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            privateKey,
            publicKey,
            refreshToken: tokens.refreshToken
        })
        
        return {
            shop: getInforData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }  

    }

    static signUp = async ({ name, email, password }) => {
        const holdShop = await shopModel.findOne({ email }).lean();
        if (holdShop) {
            throw new ConflictRequestError("Email already registered!")
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        });

        if (newShop) {
            //create private key and public key using crypto libray
            const { privateKey, publicKey } = this.keyGen();

            /**
             * save a key into db
             * @param Object { userId, publicKey}
             * @return publicKey string.
             */
            const publicKeyString = await KeyTokenService.createKeyToken({ 
                userId: newShop._id,
                publicKey,
                privateKey
            });
            
            if (!publicKeyString) {
                throw new BadRequestError("Error: Key error!");
            }

            // convert public key string is retrived from fb to public key object
            const publicKeyObject = crypto.createPublicKey(publicKeyString);

            // create token pair using jwt
            const tokens = await createTokenPair({ userId: newShop._id, email}, publicKeyObject, privateKey);

            return {
                shop: getInforData({ fields: ['_id', 'name', 'email'], object: newShop }),
                tokens
            }    
        }
    }

    static keyGen() {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        })
    }
}

module.exports = AccessService;