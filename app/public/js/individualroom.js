console.log(window.location.pathname);
let path = window.location.pathname;
$.get("/api" + path, function(data) {}).done(function(data) {
  constructClientView(data);
});

function constructClientView(data) {
  $("#room-name").text(data[0].name);
  let imgg = data[0].img.split("..");
  $(".banner").css("background-image", "url('" + imgg[1] + "')");

  let table = createtable();

  for (let i = 0; i < data.length; i++) {
    table.append(displayChore(data[i]));
  }

  $(".detail-table").append(table);
}

function createtable() {
  let table = $("<table>");
  let tr = $("<tr>");
  let chore = $("<th>");
  let notes = $("<th>");
  chore.text("Chore");
  notes.text("Notes");
  tr.append(chore);
  tr.append(notes);
  table.append(tr);
  return table;
}

function displayChore(chore) {
  let row = $("<tr>");

  let name = $("<td>");
  let notes = $("<td>");

  name.text(chore.chore_name);
  notes.text(chore.notes);

  row.append(name);
  row.append(notes);
  return row;
}
