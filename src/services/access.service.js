'use strict'

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require("../models/shop.model");
const { createTokenPair } = require('../auth/authUtils');
const KeyTokenService = require('./keytoken.service');
const { getInforData } = require('../utils');
const { ConflictRequestError, BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    /**
     * 1- check email trong dbs
     * 2- match password
     * 3- create AT vaf RT and save
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
            shop: getInforData({ fields: ['_id', 'name', 'email'], object: newShop }),
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