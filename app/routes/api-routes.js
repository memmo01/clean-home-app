let connection = require("../config/connection.js");

module.exports = function (app) {
  app.get("/house/:userId", function (req, res) {
    let queryRooms =
      "SELECT house_db.name AS location, rooms_db.name AS room, rooms_db.cleaning_timeframe AS timeframe, rooms_db.last_cleaned AS last_cleaned, house_db.id AS house_id,rooms_db.cleaning_timeframe AS cleaning_time, rooms_db.img, house_db.img AS image , rooms_db.id FROM house_db JOIN rooms_db ON house_db.id = ? AND rooms_db.house_id = ?";

    connection.query(
      queryRooms,
      [req.params.userId, req.params.userId],
      function (err, result) {
        res.json(result);
        console.log(result);
      }
    );
  });

  app.get("/api/rooms/:roomName/:roomId", function (req, res) {

    let individualRoomData =
      "SELECT chore_db.chore_name,chore_db.room_id,rooms_db.cleaning_timeframe, rooms_db.name,rooms_db.house_id AS house_id,rooms_db.last_cleaned, rooms_db.img FROM chore_db JOIN rooms_db ON rooms_db.id =" +
      req.params.roomId +
      " AND chore_db.room_id =" +
      req.params.roomId + "";


    connection.query(individualRoomData, function (err, result) {
      res.json(result)
    })



  })
  app.get("/api/roomnotes/:id/:date", function (req, res) {

    let roomnotes = "SELECT * FROM room_cleaned WHERE room_id =? AND date_cleaned =?";
    let allroomnotes = "SELECT * FROM room_cleaned WHERE room_id = ?"
    let y = req.params.date.split(".")
    let t = y.join("/")



    connection.query(roomnotes, [req.params.id, t], function (err, results) {

      res.json(results)
    })


  })



  app.get("/api/roomnotes/:id", function (req, res) {


    let allroomnotes = "SELECT room_cleaned.date_cleaned, room_cleaned.notes, room_cleaned.id, room_cleaned.room_id, rooms_db.name FROM room_cleaned JOIN rooms_db ON rooms_db.id=" + req.params.id + " AND room_cleaned.room_id =" + req.params.id + " ORDER BY room_cleaned.date_cleaned DESC";
    connection.query(allroomnotes, function (err, results) {

      res.json(results)
    })

  })

  app.get("/api/returnchores/:id", function (req, res) {
    let getchores = "SELECT task FROM tasks_completed WHERE room_cleaned_id = ?"


    connection.query(getchores, [req.params.id], function (err, results) {
      console.log(results)
      res.json(results)
    })
  })



  app.post("/api/cleanedroom", function (req, res) {
    let newid = "";
    let CleanRoomData =
      "INSERT INTO room_cleaned (date_cleaned, room_id, notes) VALUES (?,?,?)";
    let updateLastClean = "UPDATE rooms_db SET last_cleaned = ? WHERE id = ? ";
    let addtaskscomplete = "INSERT INTO tasks_completed (room_cleaned_id, task) VALUES (?,?)";

    connection.query(
      CleanRoomData,
      [req.body.last_cleaned, req.body.room_id, req.body.notes],
      function (err, result) {
        newid = result.insertId

        res.end();
        for (var i = 0; i < req.body.tasks.length; i++) {

          connection.query(addtaskscomplete, [newid, req.body.tasks[i]], function (err, results) { res.end() })
        }

      });

    connection.query(
      updateLastClean,
      [req.body.last_cleaned, req.body.room_id],
      function (err, results) {
        res.end();
      }
    );


  }



  )

  app.post("/api/addchore", function (req, res) {

    let addchores = "INSERT INTO chore_db (chore_name, room_id) VALUES (?,?)";

    let removechores =
      "DELETE FROM chore_db WHERE chore_name = ? AND room_id = ?";

    let updateroom =
      "UPDATE rooms_db SET name = ? , cleaning_timeframe = ? WHERE id = ?";


    if (req.body.newchores) {
      for (let i = 0; i < req.body.newchores.length; i++) {
        connection.query(addchores, [req.body.newchores[i], req.body.room_id]);
      }
    }

    if (req.body.removechores) {
      for (let i = 0; i < req.body.removechores.length; i++) {
        connection.query(removechores, [
          req.body.removechores[i],
          req.body.room_id
        ]);
      }
    }
    connection.query(
      updateroom,
      [req.body.name, req.body.cleaning_timeframe, req.body.room_id],
      function () {

        res.end();
      }
    );

  });

  app.post("/delete/room", function (req, res) {
    let deleteroom = "DELETE FROM rooms_db WHERE id =?";

    connection.query(deleteroom, [req.body.roomid], function () {
      console.log("room deleted")
    });
  });
  app.post("/api/newroom", function (req, res) {
    let newroominfo =
      "INSERT INTO rooms_db (name, cleaning_timeframe, last_cleaned, house_id) VALUES (?,?,?,?) ";

    let addchoreinfo =
      "SELECT id FROM rooms_db WHERE (name, cleaning_timeframe,last_cleaned)= (?,?,?) ";

    let updatechorelist =
      "INSERT INTO chore_db (chore_name, room_id) VALUES (?,?)";

    connection.query(newroominfo, [
      req.body.name,
      req.body.cleaning_timeframe,
      req.body.last_cleaned,
      req.body.house_id
    ]);

    connection.query(
      addchoreinfo,
      [req.body.name, req.body.cleaning_timeframe, req.body.last_cleaned],
      function (err, res) {
        newroomid = res[0].id;
        addchoredata(newroomid);
      }
    );

    function addchoredata(newroomid) {
      for (let i = 0; i < req.body.newchores.length; i++) {
        connection.query(
          updatechorelist,
          [req.body.newchores[i], newroomid],
          function () {
            console.log("added");
          }
        );
      }
    }
    console.log("database updated");
    res.end();
  });
};
