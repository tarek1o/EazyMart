const categoryRoute = require("./Routes/categoryRoute");
const subCategoryRoute = require("./Routes/subCategoryRoute");
const brandRoute = require("./Routes/brandRoute");
const productRoute = require("./Routes/productRoute");
const roleRoute = require("./Routes/roleRoute");
const reviewRoute = require("./Routes/reviewRoute");
const couponRoute = require("./Routes/couponRoute");
const userRoute = require("./Routes/userRoute");
const authRoute = require("./Routes/authRoute");
const orderRoute = require("./Routes/orderRoute");


const mountRoutes = (app, apiVersion) => {
    app.use(`${apiVersion}/auth`, authRoute);
    app.use(`${apiVersion}/user`, userRoute);
    app.use(`${apiVersion}/category`, categoryRoute);
    app.use(`${apiVersion}/subcategory`, subCategoryRoute);
    app.use(`${apiVersion}/brand`, brandRoute);
    app.use(`${apiVersion}/product`, productRoute);
    app.use(`${apiVersion}/role`, roleRoute);
    app.use(`${apiVersion}/review`, reviewRoute);
    app.use(`${apiVersion}/coupon`, couponRoute);
    app.use(`${apiVersion}/order`, orderRoute);
}

module.exports = mountRoutes;