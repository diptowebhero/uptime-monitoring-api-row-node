/*
 * Title: User Route
 * Description:User route handler
 * Author: Dipto Das
 * Date: 09-May-2023
 */

//dependencies
const { hash, createRandomString } = require("../../helpers/utilities");
const { parseJson } = require("../../helpers/utilities");
const data = require("./../../lib/data");
const tokenHandler = require("./tokenRouteHandler");
const { maxChecks } = require("./../../helpers/environments");

//module scaffolding
const handler = {};

handler.checksRouteHandler = (requestedProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestedProperties.method) > -1) {
    handler._checks[requestedProperties.method](requestedProperties, callback);
  } else {
    callback(405);
  }
};

handler._checks = {};

handler._checks.post = (requestedProperties, callback) => {
  //validate input
  const protocol =
    typeof requestedProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestedProperties.body.protocol) > -1
      ? requestedProperties.body.protocol
      : false;

  const url =
    typeof requestedProperties.body.url === "string" &&
    requestedProperties.body.url.trim().length > 0
      ? requestedProperties.body.url
      : false;

  const method =
    typeof requestedProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestedProperties.body.method) >
      -1
      ? requestedProperties.body.method
      : false;
  const successCodes =
    typeof requestedProperties.body.successCodes === "object" &&
    requestedProperties.body.successCodes instanceof Array
      ? requestedProperties.body.successCodes
      : false;

  const timeoutSecond =
    typeof requestedProperties.body.timeoutSecond === "number" &&
    requestedProperties.body.timeoutSecond % 1 === 0 &&
    requestedProperties.body.timeoutSecond >= 1 &&
    requestedProperties.body.timeoutSecond <= 5
      ? requestedProperties.body.timeoutSecond
      : false;

  if (protocol && method && successCodes && timeoutSecond) {
    //verify token
    const token =
      typeof requestedProperties.headers.token === "string"
        ? requestedProperties.headers.token
        : false;

    //lookup the user phone by reading the token
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        const userPhone = parseJson(tokenData).phone;

        //lookup the user data
        data.read("users", userPhone, (err2, userData) => {
          if (!err2 && userData) {
            tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                const userObj = parseJson(userData);
                const userChecks =
                  typeof userObj.checks === "object" &&
                  userObj.checks instanceof Array
                    ? userObj.checks
                    : [];
                if (userChecks.length < maxChecks) {
                  const checkId = createRandomString(20);
                  const checkObj = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSecond,
                  };

                  //save the object
                  data.create("checks", checkId, checkObj, (err3) => {
                    if (!err3) {
                      //add check id to the user's object
                      userObj.checks = userChecks;
                      userObj.checks.push(checkId);

                      //save the new user data
                      data.update("users", userPhone, userObj, (err4) => {
                        if (!err) {
                          // return the data about the new check
                          callback(200, checkObj);
                        } else {
                          callback(500, {
                            error: "There was a problem in the server side!",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "There was a problem in the server side!",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: "User has already reached max check limit!",
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
              error: "User not found!",
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
      error: "You have a problem in your request",
    });
  }
};

handler._checks.get = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.queryStringObj.id === "string" &&
    requestedProperties.queryStringObj.id.trim().length === 20
      ? requestedProperties.queryStringObj.id
      : false;

  if (id) {
    //lookup the check
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        //verify token
        const token =
          typeof requestedProperties.headers.token === "string"
            ? requestedProperties.headers.token
            : false;
        tokenHandler._token.verify(
          token,
          parseJson(checkData).userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              callback(200, parseJson(checkData));
            } else {
              callback(403, {
                error: "Authentication failure!",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "You have a problem in your request",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handler._checks.put = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.body.id === "string" &&
    requestedProperties.body.id.trim().length === 20
      ? requestedProperties.body.id
      : false;

  //validate input
  const protocol =
    typeof requestedProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestedProperties.body.protocol) > -1
      ? requestedProperties.body.protocol
      : false;

  const url =
    typeof requestedProperties.body.url === "string" &&
    requestedProperties.body.url.trim().length > 0
      ? requestedProperties.body.url
      : false;

  const method =
    typeof requestedProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestedProperties.body.method) >
      -1
      ? requestedProperties.body.method
      : false;
  const successCodes =
    typeof requestedProperties.body.successCodes === "object" &&
    requestedProperties.body.successCodes instanceof Array
      ? requestedProperties.body.successCodes
      : false;

  const timeoutSecond =
    typeof requestedProperties.body.timeoutSecond === "number" &&
    requestedProperties.body.timeoutSecond % 1 === 0 &&
    requestedProperties.body.timeoutSecond >= 1 &&
    requestedProperties.body.timeoutSecond <= 5
      ? requestedProperties.body.timeoutSecond
      : false;

  if (id) {
    if (protocol || method || url || successCodes || timeoutSecond) {
      data.read("checks", id, (err, checkData) => {
        const checkObj = parseJson(checkData);
        //verify token
        const token =
          typeof requestedProperties.headers.token === "string"
            ? requestedProperties.headers.token
            : false;
        tokenHandler._token.verify(
          token,
          checkObj.userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              if (protocol) {
                checkObj.protocol = protocol;
              }
              if (method) {
                checkObj.method = method;
              }
              if (url) {
                checkObj.url = url;
              }
              if (successCodes) {
                checkObj.successCodes = successCodes;
              }
              if (timeoutSecond) {
                checkObj.timeoutSecond = timeoutSecond;
              }

              //store check obj
              data.update("checks", id, checkObj, (err2) => {
                if (!err2) {
                  callback(200);
                } else {
                  callback(500, {
                    error: "There was a server side error!",
                  });
                }
              });
            } else {
              callback(403, {
                error: "Authentication error!",
              });
            }
          }
        );
      });
    } else {
      callback(400, {
        error: "You have a problem in your request",
      });
    }
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handler._checks.delete = (requestedProperties, callback) => {
  const id =
    typeof requestedProperties.queryStringObj.id === "string" &&
    requestedProperties.queryStringObj.id.trim().length === 20
      ? requestedProperties.queryStringObj.id
      : false;

  if (id) {
    // lookup the check
    data.read("checks", id, (err1, checkData) => {
      if (!err1 && checkData) {
        const token =
          typeof requestedProperties.headers.token === "string"
            ? requestedProperties.headers.token
            : false;

        tokenHandler._token.verify(
          token,
          parseJson(checkData).userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              // delete the check data
              data.delete("checks", id, (err2) => {
                if (!err2) {
                  data.read(
                    "users",
                    parseJson(checkData).userPhone,
                    (err3, userData) => {
                      const userObject = parseJson(userData);
                      if (!err3 && userData) {
                        const userChecks =
                          typeof userObject.checks === "object" &&
                          userObject.checks instanceof Array
                            ? userObject.checks
                            : [];

                        // remove the deleted check id from user's list of checks
                        const checkPosition = userChecks.indexOf(id);
                        if (checkPosition > -1) {
                          userChecks.splice(checkPosition, 1);
                          // resave the user data
                          userObject.checks = userChecks;
                          data.update(
                            "users",
                            userObject.phone,
                            userObject,
                            (err4) => {
                              if (!err4) {
                                callback(200);
                              } else {
                                callback(500, {
                                  error: "There was a server side problem!",
                                });
                              }
                            }
                          );
                        } else {
                          callback(500, {
                            error:
                              "The check id that you are trying to remove is not found in user!",
                          });
                        }
                      } else {
                        callback(500, {
                          error: "There was a server side problem!",
                        });
                      }
                    }
                  );
                } else {
                  callback(500, {
                    error: "There was a server side problem!",
                  });
                }
              });
            } else {
              callback(403, {
                error: "Authentication failure!",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "You have a problem in your request",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

module.exports = handler;
