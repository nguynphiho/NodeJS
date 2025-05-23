'use strict'

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helper/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keytoken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refresh-token'
}

const createTokenPair = async ( payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        });

        JWT.verify(accessToken, publicKey, ( error, decode ) => {
            if (error) {
                console.log('error verify:::', error);
            } else {
                console.log('decode verify:::', decode);
            }
        });

        return { accessToken, refreshToken }
        
    } catch (error) {
        return error;
    }
}

const authentication = asyncHandler( async (req, res, next) => {
    /*
        1 - Check userId messing?
        2 - get access token
        3 - verify token
        4 - check user in bds?
        5 - check keyStore with this userId?
        6 - Ok all => return next
    */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request!');

    const keyStore = await findByUserId( userId )
    if (!keyStore) throw new NotFoundError('Not Found keystore!');

    const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
    if (refreshToken) {
        try {
            const decodeUser = JWT.verify(refreshToken, keyStore.publicKey)
            if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId');
            req.keyStore = keyStore;
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next();
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request!')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId');
        req.keyStore = keyStore;
        req.user = decodeUser
        return next();
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, publicKey) => {
   return JWT.verify(token, publicKey)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}