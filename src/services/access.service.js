'use strict'

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require("../models/shop.model");
const { createTokenPair } = require('../auth/authUtils');
const KeyTokenService = require('./keytoken.service');
const { getInforData } = require('../utils');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            const holdShop = await shopModel.findOne({ email }).lean();
            if (holdShop) {
                return {
                    code: 'xxx',
                    message: 'Email already registered!'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            });

            if (newShop) {
                //create private key and public key using crypto libray
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
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
                    code: 201,
                    metadata: {
                        shop: getInforData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    } 
                }    
            }
        } catch (error) {
            console.log(error)
            return {
                code: 'xx1',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;