/*
 * Title: Utilities
 * Description:Common Utilities Function
 * Author: Dipto Das
 * Date: 10-May-2023
 */

//dependencies
const environment = require("./environments");
const { createHmac } = require("crypto");

// module scaffolding
const utilities = {};

utilities.parseJson = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }
  return output;
};

utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = createHmac("sha256", environment.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  }
  return false;
};

module.exports = utilities;
