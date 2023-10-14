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

    signUp = async ( req, res, next ) => {
        new CREATED({
            message: "Register Successfully",
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            }
        }).send(res);
    }
}

module.exports = new AccessController();