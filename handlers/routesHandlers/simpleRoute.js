/*
 * Title: Simple Route
 * Description:Simple Route Handler
 * Author: Dipto Das
 * Date: 09-May-2023
 */

//dependencies

//module scaffolding
const handler = {};

handler.simpleRoute = (requestedProperties, callback) => {
  //   console.log(requestedProperties);
  callback(200, {
    message: "This is simple route",
  });
};

module.exports = handler;
