'use strict'

const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic } = require('../models/product.model');

//defined Factory class to create product

class ProductService {
    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronics':
                return new Electronic(payload).createProduct();
            case 'Clothing':
                return new Clothing(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid product type :: ${type}`)
        }
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

    async createProduct(productId) {
        return await product.create({
            ...this,
            _id: productId
        });
    }
}

//define sub-class for different product type clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newClothing) throw new BadRequestError("Create clothing error");
        
        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError("Create product error");

        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) throw new BadRequestError("Create clothing error");
        
        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError("Create product error");

        return newProduct;

    }
} 

module.exports = ProductService;