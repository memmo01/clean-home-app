// get house data when loading page

$.get("/house/1", function(data) {
  console.log(data);
})
  .done(function(data) {
    constructData(data);
  })
  .fail(function(err) {
    console.log(err);
  });

let cleanpoints = 0; /* add room percentage*/
let rooms; /*Add number of rooms */
let house_cleanliness; /*average percentage of all the rooms combined*/

function constructData(data) {
  rooms = data.length;
  for (i = 0; i < data.length; i++) {
    checkroom(data[i]);
  }

  let average = cleanpoints / rooms;

  createHouseDisplay(data, average);

  //   console.log(moment().format("MM/DD/YY"));
}

function checkroom(data) {
  let timeframe = parseInt(data.cleaning_time);
  let now = moment().format("MM/DD/YY");
  let end = moment(data.end_date);
  let daysLeft = end.diff(now, "days");

  daysLeft = parseInt(daysLeft);

  let percentage = Math.round((daysLeft / data.cleaning_time) * 100);
  console.log(percentage + "%");
  cleanpoints += percentage;
}

function createHouseDisplay(data, percent) {
  let backgroundcolor = colorCheck(percent);

  let li = $("<li>");
  let a = $("<a>");
  let div = $("<div>");
  let h3 = $("<h3>");
  let percentClean = $("<div>");
  let progressbar = $("<div>");

  h3.text(data[0].location);
  percentClean.text(percent + "%");
  percentClean.addClass("percentage-clean");
  progressbar.addClass("progress-bar");
  progressbar.css("width", percent + "%");
  progressbar.css("background-color", backgroundcolor);

  div.addClass("house-overlay");
  li.attr("id", "house-1");
  div.append(h3);
  div.append(percentClean);
  div.append(progressbar);
  a.append(div);
  li.append(a);

  $(".room-list").append(li);
}

function colorCheck(percent) {
  if (percent >= 75) {
    return "green";
  } else if (percent >= 50 && percent < 75) {
    return "orange";
  } else if (percent >= 25 && percent < 50) {
    return "yellow";
  } else {
    return "red";
  }
}
