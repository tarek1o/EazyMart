const express = require("express");
const {iSWishlistBelongsToTheCurrentUser, getAllWishlists, addWishlist, deleteWishlist} = require("../Controllers/wishlistController");
const {idValidation} = require("../Middlewares/Validations/idValidation");
const {addLoginUserIdToRequestBody, addParentIdFromParamToRequestQuery} = require("../Shared/addToRequestBody");
const {addWishlistValidation} = require("../Middlewares/Validations/wishlistValidation");
const {authontication, authorization, allowClientRoleOnly, checkParamIdEqualTokenId} = require("../Middlewares/authoMiddleware");

const router = express.Router({mergeParams: true});

router.route("/")
    .all(authontication, authorization("wishlists"), checkParamIdEqualTokenId("userId"))
    .get(addParentIdFromParamToRequestQuery("user", "userId"), getAllWishlists)
    .post(allowClientRoleOnly, addLoginUserIdToRequestBody, addWishlistValidation, addWishlist)

router.route("/:id")
    .delete(idValidation, authontication, authorization("wishlists"), allowClientRoleOnly, checkParamIdEqualTokenId("userId"), iSWishlistBelongsToTheCurrentUser, deleteWishlist)

module.exports = router;
