let path = require("path");
let connection = require("../config/connection.js");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/rooms/:house", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/room-list-page.html"));
  });

  app.get("/rooms/:roomName/:roomId", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/individual-room-page.html"));
  });
  app.get("/addroom/:houseId", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/add-room.html"));
  });
};
