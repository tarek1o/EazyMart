const APIError = require('../Helper/APIError');
const couponModel = require("../Models/couponModel");
const productModel = require("../Models/productModel");

const checkProductFound = async (request, session, next) => {
    const uniqueOrderItemsProducts = Array.from(new Set(request.body.orderItems.map((orderItem) => orderItem.product)));
    const dbProducts = await productModel.find({_id: {$in: uniqueOrderItemsProducts}}, {quantity: true, sold: true, price: true, colors: true, discount: true}).session(session);
    if(dbProducts.length !== uniqueOrderItemsProducts.length){
        const dbProductsIds = dbProducts.map((product) => product._id);
        const notFoundProducts = uniqueOrderItemsProducts.filter((id) => {
            if(!dbProductsIds.includes(id))
            return id;
        });
        if(notFoundProducts.length > 1) {
            next(new APIError(`These products are not found: ${notFoundProducts}`, 404));
        }
        else {
            next(new APIError(`This product is not found ${notFoundProducts}`, 404));
        }
    }
    return dbProducts;
}

const checkProductColors = (request, dbProducts, next) => {
    const productColors = request.body.orderItems.map((orderItem) => ({_id: orderItem.product, color: orderItem.color}));
    for(const product of productColors) {
        if(product.color) {
            const matchedProduct = dbProducts.find((item) => item._id === product._id);
            if(!matchedProduct.color || !matchedProduct.color.includes(product.color)) {
                next(new APIError(`This product has not ${product.color} color: ${matchedProduct._id}`, 404));
            }
        }
    }
}

const calculateTotalQuantityForRepeatedProducts = (request) => {
    const productQuantities = request.body.orderItems.map((orderItem) => ({_id: orderItem.product, quantity: orderItem.quantity}));
    const findalProductQuantities = productQuantities.reduce((result, current) => {
        const existingItem = result.find(item => item._id === current._id);
        if (existingItem) {
            existingItem.quantity += current.quantity;
        } 
        else {
            result.push({ _id: current._id, quantity: current.quantity});
        }
        return result;
    }, []);
    return findalProductQuantities;
}

const checkProductQuantity = (request, dbProducts, next) => {
    const findalProductQuantities = calculateTotalQuantityForRepeatedProducts(request);
    for(const product of findalProductQuantities) {
        const matchedProduct = dbProducts.find((item) => item._id === product._id);
        if(matchedProduct.quantity === 0) {
            next(new APIError(`This product is out of stock: ${product._id}`, 409));
        }
        if(matchedProduct.quantity - product.quantity < 0) {
            next(new APIError(`There ${matchedProduct.quantity === 1 ? 'is only one item' : `are only ${matchedProduct.quantity} items`} available from this product: ${matchedProduct._id} in the stock`, 409));
        }
    }
    return findalProductQuantities;
}

const calculateTotalOrderPrice = async (request, dbProducts, findalProductQuantities) => {
    let totalPrice = 0;
    for(const product of findalProductQuantities) {
        const matchedProduct = dbProducts.find((item) => item._id === product._id);
        totalPrice += (matchedProduct.price - (matchedProduct.price * matchedProduct.discount)) * product.quantity;
    }
    return totalPrice;
}

const checkCouponFound = async(request, session, next) => {
    let discountPercentage = 0;
    if(request.body.coupon) {
        const coupon = await couponModel.findOne({code: request.body.coupon}, {discountPercentage: true, usedCount: true, usageLimit: true}).session(session);
        if(coupon.expirationDate < new Date() || coupon.usageLimit < coupon.usedCount + 1) {                
            next(new APIError("This copoun became expired, please reload the page", 409));
        }  
        coupon.usedCount += 1;
        discountPercentage = coupon.discountPercentage;
        await coupon.save({session})
    }
    return discountPercentage;
}

const updateProductInformation = async (request, dbProducts, findalProductQuantities, session) => {
    const bulkOption = findalProductQuantities.map((item) => ({
        updateOne: {
            filter: { _id: item._id, quantity: { $gte: item.quantity}},
            update: { $inc: {quantity: -item.quantity, sold: +item.quantity} },
        }
    }));
    // await (async () => {
    //     for(let i = 0; i < 100000000000; i++) {
    //         // console.log
    //     }
    // })();
    await productModel.bulkWrite(bulkOption, {session});
}

module.exports = {checkProductFound, checkProductColors, checkProductQuantity, calculateTotalOrderPrice, checkCouponFound, updateProductInformation}