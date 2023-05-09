/*
 * Title: Uptime monitoring Application
 * Description:A restful API monitor up to down time of user defined links
 * Author: Dipto Das
 * Date: 09-May-2023
 */

//dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const lib = require("./lib/data");

//app object - module scaffolding
const app = {};

//create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);

  server.listen(environment.port, () => {
    console.log(`listening on port ${environment.port}`);
  });
};

app.handleReqRes = handleReqRes;

//start server
app.createServer();
