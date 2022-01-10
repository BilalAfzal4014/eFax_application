const express = require("express");
const app = express();
const middlewaresManager = require('./express/middlewares/index');
const routesManager = require('./express/routes/index');


middlewaresManager.applyMiddlewares(app);
routesManager.setupRoutes(app);
middlewaresManager.applyErrorMiddlewares(app);

module.exports = app;