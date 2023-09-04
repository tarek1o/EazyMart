const express = require("express");

const router = express.Router();
const {getAllBrands, getBrandById, addBrand, updateBrand, deleteBrand} = require("../Controllers/brandController");
const {idValidation} = require("../Middlewares/Validations/idValidation")
const {addBrandValidation, updateBrandValidation} = require("../Middlewares/Validations/brandValidation")
const {uploadImageList, toFirebase} = require("../uploadFiles/uploadImage");
const {authontication, authorization} = require("../Middlewares/authoMiddleware");

const uploadFiles = [{name: "image", maxCount: 1}];

router.route("/")
    .get(getAllBrands)
    .post(authontication, authorization("brands"), uploadImageList(uploadFiles), toFirebase(uploadFiles, "brand", "brands"), addBrandValidation, addBrand)

router.route("/:id")
    .all(idValidation)
    .get(getBrandById)
    .patch(authontication, authorization("brands"), uploadImageList(uploadFiles), toFirebase(uploadFiles, "brand", "brands"), updateBrandValidation, updateBrand)
    .delete(authontication, authorization("brands"), deleteBrand)


module.exports = router;
