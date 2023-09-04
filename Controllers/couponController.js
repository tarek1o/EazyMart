const couponModel = require("../Models/couponModel")
const {getAllDocuments, getDocumentById, addDocument, updateDocument, hardDeleteDocument} = require("./baseController");

// @desc    Get All Coupons
// @route   GET /api/v1/coupon
// @access  Private
const searchFields = ['code', 'discountPercentage', 'expirationDate', 'usageLimit', 'usedCount'];
exports.getAllCoupons = getAllDocuments(couponModel, 'Coupons', ...searchFields);

// @desc    Get Coupon by ID
// @route   GET /api/v1/coupon/:id
// @access  Private
exports.getCouponById = getDocumentById(couponModel, 'Coupon');

// @desc    Create coupon
// @route   POST /api/v1/coupon
// @access  Private
exports.addCoupon = addDocument(couponModel, 'Coupon');

// @desc    Update coupon
// @route   PATCH /api/v1/coupon/:id
// @access  Private
const feildsThatAllowToUpdate = ['code', 'discountPercentage', 'expirationDate', 'usageLimit', 'usedCount', 'available', 'deleted'];
exports.updateCoupon = updateDocument(couponModel, 'Coupon', ...feildsThatAllowToUpdate);

// @desc    Delete coupon
// @route   DELETE /api/v1/coupon/:id
// @access  Private
exports.deleteCoupon = hardDeleteDocument(couponModel, 'Coupon');
