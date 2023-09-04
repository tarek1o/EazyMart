const express = require("express");

const router = express.Router({mergeParams: true});
const {getAllUserAddressByUserId, getUserAddressById, addUserAddress, updateUserAddress, deleteUserAddress} = require("../Controllers/addressController");
const {idValidation} = require("../Middlewares/Validations/idValidation")
const {addAddressValidation, updateAddressValidation} = require("../Middlewares/Validations/addressValidation")
const {authontication, authorization, checkParamIdEqualTokenId} = require("../Middlewares/authoMiddleware");


router.route("/")
    .all(authontication, authorization("users"), checkParamIdEqualTokenId("userId"))
    .get(getAllUserAddressByUserId)
    .post(addAddressValidation, addUserAddress)

router.route("/:id")
    .all(authontication, authorization("users"), checkParamIdEqualTokenId("userId"), idValidation)
    .get(getUserAddressById)
    .patch(updateAddressValidation, updateUserAddress)
    .delete(deleteUserAddress)

module.exports = router;
