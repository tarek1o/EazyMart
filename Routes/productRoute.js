const express = require("express");

const {addParentIdFromParamToRequestBody, addParentIdFromParamToRequestQuery} = require("../Shared/addToRequestBody");
const {getAllProducts, getProductById, addProduct, updateProduct, deleteProduct} = require("../Controllers/productController");
const {idValidation} = require("../Middlewares/Validations/idValidation");
const {addProductValidation, updateProductValidation} = require("../Middlewares/Validations/productValidation");
const reviewRoute = require("./reviewRoute")
const {uploadImageList, toFirebase} = require("../uploadFiles/uploadImage");
const {authontication, authorization} = require("../Middlewares/authoMiddleware");

const router = express.Router({mergeParams: true});

router.use("/:productId/review", reviewRoute);

const uploadFiles = [{name: "imageCover", maxCount: 1}, {name: "images", maxCount: 5}]

router.route("/")
    .get(addParentIdFromParamToRequestQuery("category", "categoryId"), getAllProducts)
    .post(authontication, authorization("products"), uploadImageList(uploadFiles), toFirebase(uploadFiles, "product", "products"), addParentIdFromParamToRequestBody("category", "categoryId"), addProductValidation, addProduct)

router.route("/:id")
    .all(idValidation)
    .get(getProductById)
    .patch(authontication, authorization("products"), uploadImageList(uploadFiles), toFirebase(uploadFiles, "product", "products"), updateProductValidation, updateProduct)
    .delete(authontication, authorization("products"), deleteProduct)


module.exports = router;
