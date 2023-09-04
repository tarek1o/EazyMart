const categoryModel = require("../Models/categoryModel")
const {getAllDocuments, getDocumentById, addDocument, updateDocument, softDeleteDocument} = require("./baseController");

// @desc    Create All Categories
// @route   GET /api/v1/Category
// @access  Public
const searchFields = ['name'];
exports.getAllCategories = getAllDocuments(categoryModel, 'Categories', ...searchFields);

// @desc    Create Category by ID
// @route   GET /api/v1/Category/:id
// @access  Public
exports.getCategoryById = getDocumentById(categoryModel, 'Category');

// @desc    Create Category
// @route   POST /api/v1/Category
// @access  Private
exports.addCategory = addDocument(categoryModel, 'Category');

// @desc    Update Category
// @route   PATCH /api/v1/Category/:id
// @access  Private
const feildsThatAllowToUpdate = ["name", "image", "available", "deleted"];
exports.updateCategory = updateDocument(categoryModel, 'Category', ...feildsThatAllowToUpdate);

// @desc    Delete Category
// @route   DELETE /api/v1/Category/:id
// @access  Private
exports.deleteCategory = softDeleteDocument(categoryModel, 'Category');
