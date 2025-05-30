'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required
const slugify = require('slugify');

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

    product_slug: String,
    
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
    },

    product_rating_average: {
        type: Number,
        required: false,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be lower 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },

    product_variations: {
        type: Array,
        defaults: []
    },

    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },

    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// Indexing for search
productSchema.index({ product_name: 'text', product_description: 'text' })  

// Document middleware before save, create, ...
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

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

