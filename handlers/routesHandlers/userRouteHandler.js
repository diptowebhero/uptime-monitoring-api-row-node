/*
 * Title: User Route
 * Description:User route handler
 * Author: Dipto Das
 * Date: 09-May-2023
 */

//dependencies
const { hash } = require("../../helpers/utilities");
const { parseJson } = require("../../helpers/utilities");
const data = require("./../../lib/data");
const tokenHandler = require("./tokenRouteHandler");

//module scaffolding
const handler = {};

handler.userRouteHandler = (requestedProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
    handler._users[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.post = (requestedProperties, callback) => {
  const firstName =
    typeof requestedProperties.body.firstName === "string" &&
    requestedProperties.body.firstName.trim().length > 0
      ? requestedProperties.body.firstName
      : false;
  const lastName =
    typeof requestedProperties.body.lastName === "string" &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.lastName
      : false;

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

  const tosAgreement =
    typeof requestedProperties.body.tosAgreement === "boolean" &&
    requestedProperties.body.tosAgreement
      ? requestedProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password) {
    //make sure that's user doesn't exist
    data.read("users", phone, (err1) => {
      if (err1) {
        const userObj = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        // store data in db
        data.create("users", phone, userObj, (err2) => {
          if (!err2) {
            callback(200, {
              message: "Successfully crete user",
            });
          } else {
            callback(500, {
              error: "Error, create user!",
            });
          }
        });
      } else {
        callback(400, {
          error: "There was an server side error!",
        });
      }
    });
  } else {
    callback(405, {
      error: "You have an problem in your request!",
    });
  }
};

handler._users.get = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.queryStringObj.phone === "string" &&
    requestedProperties.queryStringObj.phone.trim().length === 11
      ? requestedProperties.queryStringObj.phone
      : false;

  if (phone) {
    //verify token
    const token =
      typeof requestedProperties.headers.token === "string"
        ? requestedProperties.headers.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        //look up the user
        data.read("users", phone, (err, u) => {
          const user = { ...parseJson(u) };
          if (!err && user) {
            delete user.password;
            callback(200, user);
          } else {
            console.log(err);
            callback(400, {
              error: "Your requested url is not found!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failure!",
        });
      }
    });
  } else {
    callback(400, {
      error: "Your requested url is not found",
    });
  }
};

handler._users.put = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.body.phone === "string" &&
    requestedProperties.body.phone.trim().length === 11
      ? requestedProperties.body.phone
      : false;

  const firstName =
    typeof requestedProperties.body.firstName === "string" &&
    requestedProperties.body.firstName.trim().length > 0
      ? requestedProperties.body.firstName
      : false;
  const lastName =
    typeof requestedProperties.body.lastName === "string" &&
    requestedProperties.body.lastName.trim().length > 0
      ? requestedProperties.body.lastName
      : false;

  const password =
    typeof requestedProperties.body.password === "string" &&
    requestedProperties.body.password.trim().length > 0
      ? requestedProperties.body.password
      : false;

  if (phone) {
    //verify token
    const token =
      typeof requestedProperties.headers.token === "string"
        ? requestedProperties.headers.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        //look up the user
        if (firstName || lastName || password) {
          data.read("users", phone, (err1, uData) => {
            const userData = { ...parseJson(uData) };
            if (!err1 && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }

              if (password) {
                userData.password = hash(password);
              }

              // store data in db
              data.update("users", phone, userData, (err2) => {
                if (!err2) {
                  callback(200, {
                    message: "User was updated successfully",
                  });
                } else {
                  callback(200, {
                    error: "Error, Updating user!",
                  });
                }
              });
            } else {
              callback(400, {
                error: "Error read user!",
              });
            }
          });
        } else {
          callback(400, {
            error: "Error updating user!",
          });
        }
      } else {
        callback(403, {
          error: "Authentication failure!",
        });
      }
    });
  } else {
    callback(400, {
      error: "Your phone number is invalid!",
    });
  }
};

handler._users.delete = (requestedProperties, callback) => {
  const phone =
    typeof requestedProperties.queryStringObj.phone === "string" &&
    requestedProperties.queryStringObj.phone.trim().length === 11
      ? requestedProperties.queryStringObj.phone
      : false;

  if (phone) {
    //verify token
    const token =
      typeof requestedProperties.headers.token === "string"
        ? requestedProperties.headers.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        //look up the user
        data.read("users", phone, (err, userData) => {
          if (!err && userData) {
            data.delete("users", phone, (err1) => {
              if (!err1) {
                callback(200, {
                  error: "File, deleted successfully",
                });
              } else {
                callback(500, {
                  error: "Error, deleting file!",
                });
              }
            });
          } else {
            callback(500, {
              error: "Error read file!",
            });
          }
        });
      }
      callback(403, {
        error: "Authentication failure!",
      });
    });
  } else {
    callback(400, {
      error: "Your requested url is not found!",
    });
  }
};

module.exports = handler;
