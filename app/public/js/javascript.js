// get house data when loading page
// let something = "../images/living_room.jpg";
let urlpath = window.location.pathname;
let urlarray = urlpath.split("/");
let defaultimage = "../images/living_room.jpg";
let house;
// this when I add user login ability it will grab a unique number from the url to reference the house. For now I have it designated to house id 1.
if (urlpath === "/") {
  house = 1;
} else {
  house = urlarray[urlarray.length - 1];
  console.log(house);
}
$.get("/house/" + house + "", function (data) { })
  .done(function (data) {

    let roompath = urlarray[urlarray.length - 2];

    if (roompath === "rooms") {
      constructData(data, false);
    } else {
      constructData(data, true);
    }
  })
  .fail(function (err) {

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
      "/rooms/" + house
    );
  }
}

// gets the amount of time left to clean and turns it into a percentage
function checkRoomStats(data, wholeHouse) {

  let timeframe = parseInt(data.cleaning_time);
  let now = moment().format("MM/DD/YY");
  let end = moment(data.last_cleaned).add(timeframe, "days");
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
  if (background_image === null) {
    background_image = defaultimage;
  }
  displayWelcomeMessage(percent)
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
  li.addClass("house-1");
  li.css("background-image", "url('" + background_image + "')");
  div.append(h3);
  div.append(percentClean);
  div.append(progressbar);
  a.append(div);
  li.append(a);

  $(".room-list").append(li);
}

function displayWelcomeMessage(percent) {
  let highCleanMessage = ["The house is in great shape keep it up!", "Your house is squeaky clean!", "A clean house is a happy house, your house is overjoyed!"]
  let mediumCleanMessage = ["Your house is clean. Keep it up!", "I your hope you are enjoying your clean house.", "No need to scrub the house today. The house is a mean clean machine!"]
  let lowCleanMessage = ["We are getting closer to this place needing a good clean.", "Its looking like the house could use a good scrub", "today would be a good day to clean the house"]
  if (percent >= 60) {
    let homeMessage = randommessage(highCleanMessage)
    $("#homeMessage").text(homeMessage)
  } else if (percent < 60 && percent >= 20) {
    let homeMessage = randommessage(mediumCleanMessage)
    $("#homeMessage").text(homeMessage)
  }
  else {
    let homeMessage = randommessage(lowCleanMessage)
    $("#homeMessage").text(homeMessage)
  }
}

function randommessage(message) {
  console.log(message)
  let selected = message[Math.floor(Math.random() * message.length)]
  console.log(selected)
  return selected
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
