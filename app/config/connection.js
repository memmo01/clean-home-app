let mysql = require("mysql");

let connection = mysql.createConnection({
  port: process.env.sqlPort,
  host: "localhost",
  user: process.env.user,
  password: process.env.password,
  database: process.env.db
});

connection.connect(function(err) {
  if (err) {
    console.log("error connecting: " + err.stack);

    return;
  }
  console.log("connected as id " + connection.threadId);
});

module.exports = connection;
