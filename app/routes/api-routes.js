let connection = require("../config/connection.js");

module.exports = function(app) {
  app.get("/api/getrooms", function(req, res) {
    res.send([
      {
        title: "living room",
        percent: 50
      },
      { title: "main bedroom", percent: 30 },
      { title: "kitchen", percent: 80 },
      { title: "main bathroom", percent: 49 },
      { title: "bathroom 2", percent: 5 }
    ]);
  });

  app.get("/house/:userId", function(req, res) {
    let queryRooms =
      "SELECT house_db.name AS location, rooms_db.name AS room, rooms_db.cleaning_timeframe AS timeframe, rooms_db.last_cleaned AS last_cleaned, rooms_db.end_date AS end_date, rooms_db.cleaning_timeframe AS cleaning_time, rooms_db.img, house_db.img AS image FROM house_db JOIN rooms_db ON house_db.id = rooms_db.house_id";

    connection.query(queryRooms, function(err, result) {
      res.json(result);
      console.log(result);
    });
  });
};
