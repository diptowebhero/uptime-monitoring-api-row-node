/*
 * Title: Environments variables
 * Description:Environments variables setup
 * Author: Dipto Das
 * Date: 09-May-2023
 */

//module scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "fgfkgjfkjgkfgurrj",
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "jfksjdfdsjfgdsfjgj",
};

const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

const exportToEnvironment =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = exportToEnvironment;
