// Dependency
const {
  hashString,
  parseJSON,
  createRandomString,
} = require("./../../helpers/utilities");
const datalib = require("./../../lib/data");
const tokenHandler = require("./tokenHandler");
const { maxChecks } = require("./../../helpers/enviornment");
// Module scaffolding
const handler = {};
handler.checkHandler = (requestObject, cb) => {
  const method = requestObject.method;

  if (
    method == "get" ||
    method == "post" ||
    method == "put" ||
    method == "delete"
  ) {
    handler._check[method](requestObject, cb);
  } else {
    cb(405);
  }
};

handler._check = {};

handler._check.get = (requestObject, cb) => {
  const id =
    typeof requestObject.queryStringObject.id === "string" &&
    requestObject.queryStringObject.id.trim().length === 20
      ? requestObject.queryStringObject.id.trim()
      : null;
  const token =
    typeof requestObject.headerObject.token === "string"
      ? requestObject.headerObject.token.trim()
      : null;

  if (id) {
    datalib.read("checks", id, (err1, data1) => {
      if (!err1 && data1) {
        tokenHandler._token.verify(
          token,
          parseJSON(data1).phone,
          (isVerified) => {
            if (isVerified) {
              cb(200, parseJSON(data1));
            } else {
              cb(403, {
                error: "Authentication Problem..",
              });
            }
          }
        );
      } else {
        cb(400, {
          error: "You have a problem in your request..",
        });
      }
    });
  } else {
    cb(400, {
      error: "You have a problem in your request..",
    });
  }
};

handler._check.post = (requestObject, cb) => {
  const protocol =
    typeof requestObject.body.protocol === "string" &&
    (requestObject.body.protocol.trim() === "http" ||
      requestObject.body.protocol.trim() === "https")
      ? requestObject.body.protocol.trim()
      : null;
  const url =
    typeof requestObject.body.url === "string" &&
    requestObject.body.url.trim().length > 0
      ? requestObject.body.url.trim()
      : null;
  const method =
    typeof requestObject.body.method === "string" &&
    ["get", "put", "post", "delete", "GET", "PUT", "POST", "DELETE"].indexOf(
      requestObject.body.method.trim()
    ) > -1
      ? requestObject.body.method.trim().toUpperCase()
      : null;
  const sucessCodes =
    typeof requestObject.body.sucessCodes === "object" &&
    requestObject.body.sucessCodes instanceof Array
      ? requestObject.body.sucessCodes
      : null;
  const timeoutSeconds =
    typeof requestObject.body.timeoutSeconds === "number" &&
    requestObject.body.timeoutSeconds % 1 === 0 &&
    requestObject.body.timeoutSeconds >= 1 &&
    requestObject.body.timeoutSeconds <= 5
      ? requestObject.body.timeoutSeconds
      : null;
  const token =
    typeof requestObject.headerObject.token === "string"
      ? requestObject.headerObject.token.trim()
      : null;

  if (protocol && method && url && sucessCodes && timeoutSeconds) {
    // Look up the phone associated with token
    datalib.read("tokens", token, (err1, data1) => {
      if (!err1 && data1) {
        const phone = parseJSON(data1).phone;
        // loockup the user by phone
        datalib.read("users", phone, (err2, data2) => {
          if (!err2 && data2) {
            tokenHandler._token.verify(token, phone, (isVerified) => {
              if (isVerified) {
                const userObject = parseJSON(data2);
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];
                if (userChecks.length < 5) {
                  const checkId = createRandomString(20);
                  const checkObject = {
                    id: checkId,
                    phone,
                    protocol,
                    url,
                    method,
                    sucessCodes,
                    timeoutSeconds,
                  };
                  datalib.create("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      // add check id into user object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);
                      // save new user data
                      datalib.update("users", phone, userObject, (err4) => {
                        if (!err4) {
                          cb(200, checkObject);
                        } else {
                          cb(500, {
                            error: "Server side problem..",
                          });
                        }
                      });
                    } else {
                      cb(500, {
                        error: "Server side problem..",
                      });
                    }
                  });
                } else {
                  cb(401, {
                    error: "User has already reached max checked limit..",
                  });
                }
              } else {
                cb(403, {
                  error: "Authentication Error..",
                });
              }
            });
          } else {
            cb(500, {
              error: "User not found..",
            });
          }
        });
      } else {
        cb(403, {
          error: "Authentication Error..",
        });
      }
    });
  } else {
    cb(400, {
      error: "You have a problem in your request..",
    });
  }
};

handler._check.put = (requestObject, cb) => {
  const id =
    typeof requestObject.body.id === "string" &&
    requestObject.body.id.trim().length === 20
      ? requestObject.body.id.trim()
      : null;
  const protocol =
    typeof requestObject.body.protocol === "string" &&
    (requestObject.body.protocol.trim() === "http" ||
      requestObject.body.protocol.trim() === "https")
      ? requestObject.body.protocol.trim()
      : null;
  const url =
    typeof requestObject.body.url === "string" &&
    requestObject.body.url.trim().length > 0
      ? requestObject.body.url.trim()
      : null;
  const method =
    typeof requestObject.body.method === "string" &&
    ["get", "put", "post", "delete", "GET", "PUT", "POST", "DELETE"].indexOf(
      requestObject.body.method.trim()
    ) > -1
      ? requestObject.body.method.trim().toUpperCase()
      : null;
  const sucessCodes =
    typeof requestObject.body.sucessCodes === "object" &&
    requestObject.body.sucessCodes instanceof Array
      ? requestObject.body.sucessCodes
      : null;
  const timeoutSeconds =
    typeof requestObject.body.timeoutSeconds === "number" &&
    requestObject.body.timeoutSeconds % 1 === 0 &&
    requestObject.body.timeoutSeconds >= 1 &&
    requestObject.body.timeoutSeconds <= 5
      ? requestObject.body.timeoutSeconds
      : null;
  const token =
    typeof requestObject.headerObject.token === "string"
      ? requestObject.headerObject.token.trim()
      : null;

  if (id) {
    if (protocol || url || sucessCodes || timeoutSeconds || method) {
      datalib.read("checks", id, (err1, data1) => {
        if (!err1 && data1) {
          const checkObject = parseJSON(data1);
          tokenHandler._token.verify(token, checkObject.phone, (isVerified) => {
            if (isVerified) {
              if (protocol) {
                checkObject.protocol = protocol;
              }
              if (method) {
                checkObject.method = method;
              }
              if (url) {
                checkObject.url = url;
              }
              if (sucessCodes) {
                checkObject.sucessCodes = sucessCodes;
              }
              if (timeoutSeconds) {
                checkObject.timeoutSeconds = timeoutSeconds;
              }
              // Update the check object
              datalib.update("checks", id, checkObject, (err2) => {
                if (!err2) {
                  cb(200, {
                    message: "Check is updated sucessfully",
                  });
                } else {
                  cb(400, {
                    error: "Server side problem..",
                  });
                }
              });
            } else {
              cb(403, {
                error: "Authentication Problem..",
              });
            }
          });
        } else {
          cb(400, {
            error: "You have a problem in your request..",
          });
        }
      });
    } else {
      cb(400, {
        error: "You have to give at least one field to update..",
      });
    }
  } else {
    cb(400, {
      error: "You have a problem in a your request..",
    });
  }
};

handler._check.delete = (requestObject, cb) => {
  const id =
    typeof requestObject.queryStringObject.id === "string" &&
    requestObject.queryStringObject.id.trim().length === 20
      ? requestObject.queryStringObject.id.trim()
      : null;
  const token =
    typeof requestObject.headerObject.token === "string"
      ? requestObject.headerObject.token.trim()
      : null;

  if (id) {
    datalib.read("checks", id, (err1, data1) => {
      if (!err1 && data1) {
        const checkObject = parseJSON(data1);
        tokenHandler._token.verify(token, checkObject.phone, (isVerified) => {
          if (isVerified) {
            // Delete the check
            datalib.delete("checks", id, (err2) => {
              if (!err2) {
                datalib.read("users", checkObject.phone, (err3, data3) => {
                  if (!err3 && data3) {
                    const userObject = parseJSON(data3);
                    const checkPositiion = userObject.checks.indexOf(id);
                    if (checkPositiion > -1) {
                      // delete from array
                      userObject.checks.splice(checkPositiion, 1);
                      datalib.update(
                        "users",
                        checkObject.phone,
                        userObject,
                        (err4) => {
                          if (!err4) {
                            cb(200, {
                              message: "Check is deleted sucessfully",
                            });
                          } else {
                            cb(500, {
                              error: "Server side Problem..",
                            });
                          }
                        }
                      );
                    } else {
                      cb(400, {
                        error:
                          "The check id that you are trying to delete is not found in user..",
                      });
                    }
                  } else {
                    cb(500, {
                      error: "Server side Problem..",
                    });
                  }
                });
              } else {
                cb(500, {
                  error: "Server side Problem..",
                });
              }
            });
          } else {
            cb(403, {
              error: "Authentication Problem..",
            });
          }
        });
      } else {
        cb(400, {
          error: "You have a problem a in your request..",
        });
      }
    });
  } else {
    cb(400, {
      error: "You have a problem in  your request..",
    });
  }
};

module.exports = handler;
