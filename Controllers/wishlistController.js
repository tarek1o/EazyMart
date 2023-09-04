const asyncHandler = require("express-async-handler");
const APIError = require("../Helper/APIError");
const wishlistModel = require("../Models/wishlistModel")
const {getAllDocuments, addDocument, hardDeleteDocument} = require("./baseController");

// @desc    Check If The Wishlist Belongs To The Current User
// @route   No
// @access  No
exports.iSWishlistBelongsToTheCurrentUser = asyncHandler(async (request, response, next) => {
    const wishlist = await wishlistModel.findById(request.params.id, {user: 1});
    if(request.user.id !== wishlist.user) {
        throw new APIError("This wishlist doesn't belongs to the current user", 403);
    }
    next();
});

// @desc    Get All Wishlists
// @route   GET /api/v1/user/:userId/wishlist
// @access  Private
const searchFields = ['product', 'user'];
exports.getAllWishlists = getAllDocuments(wishlistModel, 'Wishlists', ...searchFields);

// @desc    Create Wishlist
// @route   POST /api/v1/user/:userId/wishlist
// @access  Private
exports.addWishlist = addDocument(wishlistModel, 'Wishlist');

// @desc    Delete Wishlist
// @route   DELETE /api/v1/user/:userId/wishlist/:id
// @access  Private
exports.deleteWishlist = hardDeleteDocument(wishlistModel, 'Wishlist');
