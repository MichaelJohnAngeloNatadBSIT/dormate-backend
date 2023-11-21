const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyAdminSignUp = require("./verifyAdminSignUp");
const adminAuthJwt = require("./adminAuthJwt");

module.exports = {
  authJwt,
  verifySignUp,
  verifyAdminSignUp,
  adminAuthJwt
};