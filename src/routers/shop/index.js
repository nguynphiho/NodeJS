'use strict'

const express = require('express');
const asyncHandler = require("../../helper/asyncHandler");
const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');

const router = express.Router();

//authentication
router.use(authentication);

router.post('/product/create', asyncHandler(productController.createProduct));


module.exports = router;