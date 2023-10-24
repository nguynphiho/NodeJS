'user strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: { 
        type: String,
        required: true
    },

    product_thumb: {
        type: String,
        required: true
    },

    product_description: {
        type: String,
    },
    
    product_price: {
        type: Number,
        require: true
    },

    product_quantity: {
        type: Number,
        required: true
    },

    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Funiture']
    },

    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },

    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//define the product type = clothing
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },

    size: String,

    material: String,
}, {
    colletion: 'Clothes',
    timestamps: true,
});

const electronicSchema = new Schema({
    manufactor: {
        type: String,
        required: true
    },

    size: String,

    material: String,
}, {
    colletion: 'Electronics',
    timestamps: true
});

module.exports = {
    product: model( DOCUMENT_NAME, productSchema),
    electronic: model( 'Electronic', electronicSchema),
    clothing: model('Clothing', clothingSchema)
}

