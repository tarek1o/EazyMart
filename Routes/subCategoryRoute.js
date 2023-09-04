const express = require("express");

const {addParentIdFromParamToRequestBody, addParentIdFromParamToRequestQuery} = require("../Shared/addToRequestBody");
const {getAllSubCategories, getSubCategoryById, addSubCategory, updateSubCategory, deleteSubCategory} = require("../Controllers/subCategoryController");
const {idValidation} = require("../Middlewares/Validations/idValidation")
const {addSubCategoryValidation, updateSubCategoryValidation} = require("../Middlewares/Validations/subCategoryValidation")
const {uploadImageList, toFirebase} = require("../uploadFiles/uploadImage");
const {authontication, authorization} = require("../Middlewares/authoMiddleware");

//mergeParams: Allow us to access parameters on the other routers
const router = express.Router({mergeParams: true});

const uploadFiles = [{name: "image", maxCount: 1}];


router.route("/")
    .get(addParentIdFromParamToRequestQuery("category", "categoryId"), getAllSubCategories)
    .post(authontication, authorization("subcategories"), addParentIdFromParamToRequestBody("category", "categoryId"), uploadImageList(uploadFiles), toFirebase(uploadFiles, "subcategory", "subcategories"), addSubCategoryValidation, addSubCategory)

router.route("/:id")
    .all(idValidation)
    .get(getSubCategoryById)
    .patch(authontication, authorization("subcategories"), uploadImageList(uploadFiles), toFirebase(uploadFiles, "subcategory", "subcategories"), updateSubCategoryValidation, updateSubCategory)
    .delete(authontication, authorization("subcategories"), deleteSubCategory)


module.exports = router;
