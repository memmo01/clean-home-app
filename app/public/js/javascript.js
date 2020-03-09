// get house data when loading page
// let something = "../images/living_room.jpg";
$.get("/house/1", function(data) {})
  .done(function(data) {
    if (window.location.pathname === "/rooms") {
      constructData(data, false);
    } else {
      constructData(data, true);
    }
  })
  .fail(function(err) {
    console.log(err);
  });

let cleanpoints = 0; /* add room percentage*/
let rooms; /*Add number of rooms */
let house_cleanliness; /*average percentage of all the rooms combined*/

function constructData(data, wholeHouse) {
  rooms = data.length;
  for (i = 0; i < data.length; i++) {
    checkRoomStats(data[i], wholeHouse);
  }

  if (wholeHouse) {
    let average = Math.round(cleanpoints / rooms);

    createHouseDisplay(
      data,
      average,
      data[0].location,
      data[0].image,
      "/rooms"
    );
  }
}

// gets the amount of time left to clean and turns it into a percentage
function checkRoomStats(data, wholeHouse) {
  let timeframe = parseInt(data.cleaning_time);
  let now = moment().format("MM/DD/YY");
  let end = moment(data.end_date);
  let daysLeft = end.diff(now, "days");
  daysLeft = parseInt(daysLeft);
  let cleanName = urlPrep(data.room);
  if (daysLeft < 0) {
    daysLeft = 0;
  }

  let percentage = createPercentage(daysLeft, data.cleaning_time);

  wholeHouse
    ? (cleanpoints += percentage) //this add the percentages of rooms up for house view
    : createHouseDisplay(
        data,
        percentage,
        data.room,
        data.img,
        "/rooms/" + cleanName + "/" + data.id
      ); // create individual room data if on rooms page
}

function urlPrep(input) {
  let urlText = input
    .split(" ")
    .join("-")
    .toLowerCase();
  return urlText;
}

// percentage function
function createPercentage(daysLeft, cleaning_time) {
  let percent = Math.round((daysLeft / cleaning_time) * 100);
  return percent;
}

// dynamically create display of house average data or individual room data
function createHouseDisplay(data, percent, title, background_image, link) {
  let backgroundcolor = colorCheck(percent);

  let li = $("<li>");
  let a = $("<a>");
  let div = $("<div>");
  let h3 = $("<h3>");
  let percentClean = $("<div>");
  let progressbar = $("<div>");

  h3.text(title);
  if (percent <= 0) {
    percentClean.text("Needs Cleaning");
    percentClean.css("background-color", "rgba(0,0,0,.7)");
    percentClean.css("font-size", "35px");
    percentClean.css("color", "red");
  } else {
    percentClean.text(percent + "%");
  }

  percentClean.addClass("percentage-clean");
  progressbar.addClass("progress-bar");
  progressbar.css("width", percent + "%");
  progressbar.css("background-color", backgroundcolor);

  a.attr("href", "" + link + "");
  div.addClass("house-overlay");
  li.attr("id", "house-1");
  li.css("background-image", "url('" + background_image + "')");
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
