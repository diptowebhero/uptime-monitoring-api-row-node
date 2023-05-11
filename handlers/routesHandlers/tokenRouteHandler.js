/*
 * Title: Token route
 * Description:Handler to handle token route
 * Author: Dipto Das
 * Date: 11-May-2023
 */

//dependencies
const { hash } = require("../../helpers/utilities");
const { parseJson } = require("../../helpers/utilities");
const { createRandomString } = require("../../helpers/utilities");
const data = require("./../../lib/data");

//module scaffolding
const handler = {};

handler.tokenRouteHandler = (requestedProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
    handler._token[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.body.phone === "string" &&
    requestedProperties.body.phone.trim().length === 11
      ? requestedProperties.body.phone
      : false;

  const password =
    typeof requestedProperties.body.password === "string" &&
    requestedProperties.body.password.trim().length > 0
      ? requestedProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        const hashedPass = hash(password);

        if (hashedPass === parseJson(userData).password) {
          const tokenId = createRandomString(20);
          const expires = Date.now() + 60 * 60 * 1000;

          const tokenObj = {
            phone,
            id: tokenId,
            expires,
          };

          //store data in db
          data.create("tokens", tokenId, tokenObj, (err1) => {
            if (!err1) {
              callback(200, tokenObj);
            } else {
              callback(500, {
                error: "There was an problem in server side!",
              });
            }
          });
        } else {
          callback(400, {
            error: "Your password is invalid!",
          });
        }
      } else {
        callback(400, {
          error: "Error, read the file",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have an problem in your request!",
    });
  }
};

handler._token.get = (requestedProperties, callback) => {};

handler._token.put = (requestedProperties, callback) => {};
handler._token.delete = (requestedProperties, callback) => {};

module.exports = handler;
