'use strict'

const express = require('express')
const asyncHandler = require("../../helper/asyncHandler")
const { authentication } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

const router = express.Router()

router.get('', asyncHandler(productController.findAllProduct))
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('/:productId', asyncHandler(productController.findProduct))

//authentication
router.use(authentication)

router.post('/create', asyncHandler(productController.createProduct))
router.get('/draff/all', asyncHandler(productController.getAllDraff))
router.get('/published/all', asyncHandler(productController.getAllPublished))
router.patch('/published/:id', asyncHandler(productController.publishedProduct))
router.patch('/unpublished/:id', asyncHandler(productController.unPublishedProduct))

module.exports = router