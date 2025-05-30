'use strict'

const { CREATED, OK } = require("../core/success.response")
const ProductService = require("../services/product.service")

class ProductController {
    createProduct = async (req, res, next) => {
        new CREATED({
            message: "Create new product success!",
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllDraff = async (req, res, next) => {
        new OK({
            message: "Find All Draff Product success!",
            metadata: await ProductService.findAllDraffForShop({ product_shop: req.user.userId })
        }).send(res)
    }

    publishedProduct = async (req, res, next) => {
        new OK({
            message: "Published Product success!",
            metadata: await ProductService.publishedProductByShop({ 
                product_shop: req.user.userId, 
                product_id: req.params.id 
            })
        }).send(res)
    }

    unPublishedProduct = async (req, res, next) => {
        new OK({
            message: "UnPublished Product success!",
            metadata: await ProductService.unPublishedProductByShop({ 
                product_shop: req.user.userId, 
                product_id: req.params.id 
            })
        }).send(res)
    }

    getAllPublished = async (req, res, next) => {
        new OK({
            message: "Find All Published Product success!",
            metadata: await ProductService.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new OK({
            message: `Get All product with key ${req.params.keySearch}`,
            metadata: await ProductService.getListSearchProductByUser({
                keySearch: req.params.keySearch
            })
        }).send(res)
    }

    findAllProduct = async (req, res, next) => {
        new OK({
            message: `Get All Products`,
            metadata: await ProductService.findAllProduct({ })
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new OK({
            message: `Get product with id: ${req.params.productId}`,
            metadata: await ProductService.findProduct({ productId: req.params.productId })
        }).send(res)
    }
    
    updateProduct = async (req, res, next) => {
        new OK({
            message: `Update Product successfully`,
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new ProductController();