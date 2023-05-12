/*
 * Title: Handle routes
 * Description:Handle routes
 * Author: Dipto Das
 * Date: 09-May-2023
 */

//dependencies
const {
  checksRouteHandler,
} = require("./handlers/routesHandlers/checkRouteHandler");
const { simpleRoute } = require("./handlers/routesHandlers/simpleRoute");
const {
  tokenRouteHandler,
} = require("./handlers/routesHandlers/tokenRouteHandler");
const {
  userRouteHandler,
} = require("./handlers/routesHandlers/userRouteHandler");

const routes = {
  simple: simpleRoute,
  user: userRouteHandler,
  token: tokenRouteHandler,
  check: checksRouteHandler,
};

module.exports = routes;
