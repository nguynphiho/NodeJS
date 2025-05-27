'use strict'

const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic } = require('../models/product.model');
const { 
    findAll,
    findOne,
    findAllDraff,
    findAllPublished,
    searchProductByUser,
    publishedProductByShop,
    unPublishedProductByShop,
} = require('../repository/product.repo')

//defined Factory class to create product

class ProductService {

    static productTypes = {}

    static productTypeRegister = (type, classRef) => {
        ProductService.productTypes[type] = classRef
    }

    static async createProduct(type, payload) {
        const productType = ProductService.productTypes[type]
        if (!productType) throw new BadRequestError(`Invalid Product Type: ${type}`)
        return new productType(payload).createProduct()
    }

    static async findAllDraffForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraff({ query, limit, skip })
    }

    static async publishedProductByShop({ product_shop, product_id }) {
        return await publishedProductByShop({ product_shop, product_id })
    }

    static async unPublishedProductByShop({ product_shop, product_id }) {
        return await unPublishedProductByShop({ product_shop, product_id })
    }

    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublished({ query, limit, skip })
    }

    static async getListSearchProductByUser({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProduct({ query = { isPublished: true }, limit = 50, sort = 'ctime', page = 1, select = ['product_name', 'product_thumb', 'product_price'] }) {
        return await findAll({ query, limit, sort, page, select })
    }

    static async findProduct({ productId }) {
        return await findOne({ productId, unSelect: ['__v']})
    }

}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_type, product_shop, product_attributes, product_quantity
    }){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_quantity = product_quantity;
    }

    async createProduct() {
        return await product.create(this);
    }
}

//define subclass for different product type clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError("Create clothing error");
        
        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError("Create product error");

        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.product_attributes);
        if (!newElectronic) throw new BadRequestError("Create clothing error");
        
        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError("Create product error");

        return newProduct;

    }
}

ProductService.productTypeRegister(Clothing.name, Clothing)
ProductService.productTypeRegister(Electronic.name, Electronic)

module.exports = ProductService;