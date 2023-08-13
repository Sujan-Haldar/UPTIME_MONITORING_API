// Dependency
const server = require("./lib/server");
const worker = require("./lib/worker");

// App object
const app = {};

app.init = () => {
  // Start the server
  server.init();
  // Start the worker
  worker.init();
};

app.init();

module.exports = app;
