const router = require("express").Router();
const faxRoutes = require("./fax/fax-routes");


const setupRoutes = (app) => {
    router.use("/fax", faxRoutes);
    app.use("/v1", router);
};

module.exports = {
    setupRoutes,
};