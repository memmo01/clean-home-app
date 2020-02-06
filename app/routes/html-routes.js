let path = require("path");
let connection = require("../config/connection.js");

module.exports = function(app) {
  app.get("/", function(req, res) {
    req.sendFile(path.join(__dirname, "../public/index.html"));
  });
};
