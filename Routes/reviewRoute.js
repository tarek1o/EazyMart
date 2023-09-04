const express = require("express");

const {getAllReviews, getReviewById, addReview, updateReview, deleteReview} = require("../Controllers/reviewController");
const {idValidation} = require("../Middlewares/Validations/idValidation");
const {addParentIdFromParamToRequestBody, addParentIdFromParamToRequestQuery, addLoginUserIdToRequestBody} = require("../Shared/addToRequestBody");
const {addReviewValidation, updateReviewValidation} = require("../Middlewares/Validations/reviewValidation");
const {authontication, authorization, allowClientRoleOnly} = require("../Middlewares/authoMiddleware");

const router = express.Router({mergeParams: true});

router.route("/")
    .get(addParentIdFromParamToRequestQuery("product", "productId"), getAllReviews)
    .post(authontication, authorization("reviews"), allowClientRoleOnly, addParentIdFromParamToRequestBody("product", "productId"), addLoginUserIdToRequestBody, addReviewValidation, addReview)

router.route("/:id")
    .all(idValidation)
    .get(getReviewById)
    .patch(authontication, authorization("reviews"), allowClientRoleOnly, updateReviewValidation, updateReview)
    .delete(authontication, authorization("reviews"), deleteReview)


module.exports = router;
