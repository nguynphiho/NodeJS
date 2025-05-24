'use strict'

const { CREATED, OK } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    login = async (req, res, next) => {
        new OK({
            message: "Login Successfully",
            metadata: await AccessService.login( req.body ),
        }).send(res);
    }

    logout = async (req, res, next) => {
        new OK({
            message: "Logout Successfully",
            metadata: await AccessService.logout( req.keyStore ),
        }).send(res);
    }

    signUp = async ( req, res, next ) => {
        new CREATED({
            message: "Register Successfully",
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            }
        }).send(res);
    }

    handleRefreshToken = async (req, res, next) => {
        new OK({
            message: "Get Token Successfully",
            metadata: await AccessService.handleRefreshTokenUsed({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
}

module.exports = new AccessController();