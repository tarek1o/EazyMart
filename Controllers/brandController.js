const brandModel = require("../Models/brandModel")
const {getAllDocuments, getDocumentById, addDocument, updateDocument, softDeleteDocument} = require("./baseController");

// @desc    Create All Brands
// @route   GET /api/v1/brand
// @access  Public
const searchFields = ['name'];
exports.getAllBrands = getAllDocuments(brandModel, 'Brands', ...searchFields);

// @desc    Create Brand by ID
// @route   GET /api/v1/brand/:id
// @access  Public
exports.getBrandById = getDocumentById(brandModel, 'Brand');

// @desc    Create Brand
// @route   POST /api/v1/brand
// @access  Private
exports.addBrand = addDocument(brandModel, 'Brand');

// @desc    Update Brand
// @route   PATCH /api/v1/brand/:id
// @access  Private
const feildsThatAllowToUpdate = ["name", "image", "available", "deleted"];
exports.updateBrand = updateDocument(brandModel, 'Brand', ...feildsThatAllowToUpdate);

// @desc    Delete Brand
// @route   DELETE /api/v1/brand/:id
// @access  Private
exports.deleteBrand = softDeleteDocument(brandModel, 'Brand');