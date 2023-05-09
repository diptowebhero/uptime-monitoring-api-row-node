/*
 * Title: Handle Request & Response
 * Description:Handle Request &  Response
 * Author: Dipto Das
 * Date: 09-May-2023
 */

//dependencies
const url = require("url");
const routes = require("./../routes");
const { StringDecoder } = require("string_decoder");
const {
  notFoundHandler,
} = require("../handlers/routesHandlers/notFoundHandler");

//module scaffolding
const handler = {};

//handle req res
handler.handleReqRes = (req, res) => {
  // handle request
  //get url and part it
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.path;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const queryObj = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headers = req.headers;

  const requestedProperties = {
    parsedUrl,
    path,
    method,
    trimmedPath,
    queryObj,
    headers,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    chosenHandler(requestedProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const stringData = JSON.stringify(payload);

      //   return final response
      res.writeHead(statusCode);
      res.end(stringData);
    });
  });
};

//export function
module.exports = handler;
