const express = require("express");

const router = express.Router();
const {getAllRoles, getRoleById, addRole, updateRole, deleteRole} = require("../Controllers/roleController");
const {idValidation} = require("../Middlewares/Validations/idValidation")
const {addRoleValidation, updateRoleValidation} = require("../Middlewares/Validations/roleValidation")
const {authontication, authorization} = require("../Middlewares/authoMiddleware");

router.route("/")
    .all(authontication, authorization("roles"))
    .get(getAllRoles)
    .post(addRoleValidation, addRole)

router.route("/:id")
    .all(authontication, authorization("roles"), idValidation)
    .get(getRoleById)
    .patch(updateRoleValidation, updateRole)
    .delete(deleteRole)


module.exports = router;
