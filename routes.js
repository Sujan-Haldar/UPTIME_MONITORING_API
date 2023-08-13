// Dependency
const {sampleHandler} = require("./handlers/routeHandlers/sampleHandler");
const {userHandler} = require("./handlers/routeHandlers/userHandler")
const {tokenHandler} = require("./handlers/routeHandlers/tokenHandler")
const {checkHandler} = require("./handlers/routeHandlers/checkHandler")

// Module scaffolding
const routes = {
    "" : sampleHandler,
    "sample" : sampleHandler,
    "user" : userHandler,
    "token" : tokenHandler,
    "check" : checkHandler,
};

module.exports = routes;
