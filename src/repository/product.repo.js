'use strict'

const { product, electronic, clothing } = require('../models/product.model');
const { Types } = require('mongoose');
const { getSelectData, getUnSelectData } = require('../utils/index')

const findAllDraff = async function({ query, limit, skip, sort = { updateAt: -1}, populate = 'product_shop', selectPopulate = 'name email -_id' }) {
    return await queryProduct({
        query, limit, skip, sort,
        populate,
        selectPopulate
    })
}

const publishedProductByShop = async function(
    { product_shop, product_id }
) {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const unPublishedProductByShop = async function(
    { product_shop, product_id }
) {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const findAllPublished = async function(
    { query, limit, skip, sort = { updateAt: -1}, populate = 'product_shop', selectPopulate = 'name email -_id' }
) {
    return await queryProduct({
        query, limit, skip,sort,
        populate,
        selectPopulate
    })
}

const searchProductByUser = async function({ keySearch }) {
    return await product.find(
        { 
            $text: { $search: keySearch },
            isPublished: true 
        },
        { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean()
    .exec()
}

const findAll = async function({ query, limit, sort, page, select }) {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1}
    const products = await queryProduct({ 
        query,
        limit,
        sort: sortBy,
        skip,
        select
    })

    return products
}

const findOne = async function({ productId, unSelect }){
    return await product.findById(productId).select(getUnSelectData(unSelect))
}

const updateProductById = async function ({ model, productId, updateBody, isNew = true}) {
    return await model.findByIdAndUpdate(productId, updateBody, { new: isNew })
}

const queryProduct = async function({ query, limit, sort, skip, populate, selectPopulate, select = [] }) {
    return await product.find(query)
        .populate(populate, selectPopulate)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
        .exec()
}

module.exports = {
    findAll,
    findOne,
    findAllDraff,
    findAllPublished,
    updateProductById,
    searchProductByUser,
    publishedProductByShop,
    unPublishedProductByShop,
}