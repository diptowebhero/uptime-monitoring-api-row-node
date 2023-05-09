/*
 * Title: Not found route
 * Description:Not found route Handler
 * Author: Dipto Das
 * Date: 09-May-2023
 */

//dependencies

//module scaffolding
const handler = {};

handler.notFoundHandler = (requestedProperties, callback) => {
  //   console.log(requestedProperties);
  callback(404, {
    message: "Your requested url is not found!",
  });
};

module.exports = handler;
