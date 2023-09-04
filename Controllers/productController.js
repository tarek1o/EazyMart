const productModel = require("../Models/productModel")
const {getAllDocuments, getDocumentById, addDocument, updateDocument, softDeleteDocument} = require("./baseController");

// @desc    Get All Products
// @route   GET /product
// @access  Public
const searchFields = ['title', 'description'];
exports.getAllProducts = getAllDocuments(productModel, 'Products', ...searchFields);

// @desc    Get Product by ID
// @route   GET /api/v1/Product/:id
// @access  Public
exports.getProductById = getDocumentById(productModel, 'Product');

// @desc    Create Product
// @route   POST /api/v1/Product
// @access  Private
exports.addProduct = addDocument(productModel, 'Product');

// @desc    Update Product
// @route   PATCH /api/v1/Product/:id
// @access  Private
const feildsThatAllowToUpdate = ["title", "description", "quantity", "sold", "price", "discount", "colors", "imageCover", "images", "ratingsAverage", "ratingsQuantity", "category", "subCategories", "brand", "available", "deleted"];
exports.updateProduct = updateDocument(productModel, 'Product', ...feildsThatAllowToUpdate);

// @desc    Delete Product
// @route   DELETE /api/v1/Product/:id
// @access  Private
exports.deleteProduct = softDeleteDocument(productModel, 'Product');
