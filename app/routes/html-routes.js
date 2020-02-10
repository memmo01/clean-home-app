let path = require("path");
let connection = require("../config/connection.js");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/rooms", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/room-list-page.html"));
  });
};
