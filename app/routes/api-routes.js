module.exports = function(app) {
  app.get("/api/getrooms", function(req, res) {
    res.send([
      { title: "living room", percent: 50 },
      { title: "main bedroom", percent: 30 },
      { title: "kitchen", percent: 80 },
      { title: "main bathroom", percent: 49 },
      { title: "bathroom 2", percent: 5 }
    ]);
  });
};
