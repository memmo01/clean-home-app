let connection = require("../config/connection.js");

module.exports = function(app) {
  app.get("/house/:userId", function(req, res) {
    console.log("HOWDY");
    let queryRooms =
      "SELECT house_db.name AS location, rooms_db.name AS room, rooms_db.cleaning_timeframe AS timeframe, rooms_db.last_cleaned AS last_cleaned, rooms_db.cleaning_timeframe AS cleaning_time, rooms_db.img, house_db.img AS image , rooms_db.id FROM house_db JOIN rooms_db ON house_db.id = rooms_db.house_id";

    connection.query(queryRooms, function(err, result) {
      res.json(result);
      console.log(result);
    });
  });

  app.get("/api/rooms/:roomName/:roomId", function(req, res) {
    let individualRoomData =
      "SELECT chore_db.chore_name,chore_db.room_id,rooms_db.cleaning_timeframe, rooms_db.name, rooms_db.img FROM chore_db JOIN rooms_db ON rooms_db.id =" +
      req.params.roomId +
      " AND chore_db.room_id =" +
      req.params.roomId +
      "";
    connection.query(individualRoomData, function(err, result) {
      res.json(result);
      console.log(result);
    });
  });

  app.post("/api/cleanedroom", function(req, res) {
    let CleanRoomData =
      "INSERT INTO room_cleaned (date_cleaned, room_id, notes) VALUES (?,?,?)";
    let updateLastClean = "UPDATE rooms_db SET last_cleaned = ? WHERE id = ? ";

    connection.query(
      CleanRoomData,
      [req.body.last_cleaned, req.body.room_id, req.body.notes],
      function(err, result) {
        console.log("saved successfully");

        res.end();
      }
    );

    connection.query(
      updateLastClean,
      [req.body.last_cleaned, req.body.room_id],
      function(err, results) {
        res.end();
      }
    );
  });

  app.post("/api/addchore", function(req, res) {
    console.log(req.body);
    let addchores = "INSERT INTO chore_db (chore_name, room_id) VALUES (?,?)";

    let removechores =
      "DELETE FROM chore_db WHERE chore_name = ? AND room_id = ?";

    let updateroom =
      "UPDATE rooms_db SET name = ? , cleaning_timeframe = ? WHERE id = ?";

    if (req.body.newchores)
      for (let i = 0; i < req.body.newchores.length; i++) {
        connection.query(addchores, [req.body.newchores[i], req.body.room_id]);
      }

    if (req.body.removechores) {
      for (let i = 0; i < req.body.removechores.length; i++) {
        connection.query(removechores, [
          req.body.removechores[i],
          req.body.room_id
        ]);
      }
    }
    connection.query(updateroom, [
      req.body.name,
      req.body.cleaning_timeframe,
      req.body.room_id
    ]);
    // connection.query(addchores, [req.body.new_chore]);

    // connection.query(
    //   CleanRoomData,
    //   [req.body.last_cleaned, req.body.room_id, req.body.notes],
    //   function(err, result) {
    //     console.log("saved successfully");

    //     res.end();
    //   }
  });
};
