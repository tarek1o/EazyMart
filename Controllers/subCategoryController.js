const subCategoryModel = require("../Models/subCategoryModel")
const {getAllDocuments, getDocumentById, addDocument, updateDocument, softDeleteDocument} = require("./baseController");

// @desc    Get All SubCategories for specific category
// @route   GET /api/v1/subcategory
// @access  Public
const searchFields = ['name'];
exports.getAllSubCategories = getAllDocuments(subCategoryModel, 'Subcategories', ...searchFields);

// @desc    Get Category by ID
// @route   GET /api/v1/Category/:id
// @access  Public
exports.getSubCategoryById = getDocumentById(subCategoryModel, 'Subcategory');

// @desc    Create SubCategory
// @route   POST /api/v1/subcategory
// @access  Private
exports.addSubCategory = addDocument(subCategoryModel, 'Subcategory');

// @desc    Update SubCategory
// @route   PATCH /api/v1/subcategory/:id
// @access  Private
const feildsThatAllowToUpdate = ["name", "image", "category", "available", "deleted"];
exports.updateSubCategory = updateDocument(subCategoryModel, 'SubCategory', ...feildsThatAllowToUpdate);

// @desc    Delete SubCategory
// @route   DELETE /api/v1/subcategory/:id
// @access  Private
exports.deleteSubCategory = softDeleteDocument(subCategoryModel, 'SubCategory');