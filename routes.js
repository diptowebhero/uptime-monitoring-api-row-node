/*
 * Title: Handle routes
 * Description:Handle routes
 * Author: Dipto Das
 * Date: 09-May-2023
 */

//dependencies
const { simpleRoute } = require("./handlers/routesHandlers/simpleRoute");
const {
  userRouteHandler,
} = require("./handlers/routesHandlers/userRouteHandler");

const routes = {
  simple: simpleRoute,
  user: userRouteHandler,
};

module.exports = routes;
