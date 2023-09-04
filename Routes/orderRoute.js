const express = require("express");

const router = express.Router({mergeParams: true});
const {addUserIdToRequestQueryAtClientRole, getAllOrders, addOrder, addOrderOnline} = require("../Controllers/orderController");
const {idValidation} = require("../Middlewares/Validations/idValidation")
const {addOrderValidation} = require("../Middlewares/Validations/orderValidation")
const {authontication, authorization, allowClientRoleOnly} = require("../Middlewares/authoMiddleware");
const {addLoginUserIdToRequestBody} = require("../Shared/addToRequestBody");

router.route("/")
    .all(authontication, authorization("orders"))
    .get(addUserIdToRequestQueryAtClientRole, getAllOrders)
    .post(allowClientRoleOnly, addLoginUserIdToRequestBody, addOrderValidation, addOrder)

router.route('/online')
    .post(addOrderOnline)

// router.route("/:id")
//     .all(authontication, authorization("orders"), idValidation)
//     .get()
//     .patch()
//     .delete()


/**
    1) Frontend send a request for asking a client secret key that will create incomplete operation in the stripe
    2) This secret key will be send to the frontend to use it 
 */


module.exports = router;
