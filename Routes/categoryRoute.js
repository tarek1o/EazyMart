const express = require("express");

const router = express.Router();
const {getAllCategories, getCategoryById, addCategory, updateCategory, deleteCategory} = require("../Controllers/categoryController");
const {idValidation} = require("../Middlewares/Validations/idValidation")
const {addCategoryValidation, updateCategoryValidation} = require("../Middlewares/Validations/categoryValidation")
const subCategoryRoute = require("./subCategoryRoute");
const productRoute = require("./productRoute");
const {uploadImageList, toFirebase} = require("../uploadFiles/uploadImage");
const {authontication, authorization} = require("../Middlewares/authoMiddleware");

//Redirect to subcategory route
router.use("/:categoryId/subcategory", subCategoryRoute);
router.use("/:categoryId/product", productRoute);

const uploadFiles = [{name: "image", maxCount: 1}];

router.route("/")
    .get(getAllCategories)
    .post(authontication, authorization("categories"), uploadImageList(uploadFiles), toFirebase(uploadFiles, "category", "categories"), addCategoryValidation, addCategory)

router.route("/:id")
    .all(idValidation)
    .get(getCategoryById)
    .patch(authontication, authorization("categories"), uploadImageList(uploadFiles), toFirebase(uploadFiles, "category", "categories"), updateCategoryValidation, updateCategory)
    .delete(authontication, authorization("categories"), deleteCategory)


module.exports = router;
