// when room-list-page loads:
// 1) check if there are any room added in the database
// 2) if there are rooms, get the information about them and place them into an Array
// 3) loop through the array of rooms populating information as a visual for client side to see

// function for getting information
// function creating html dynamically

let roomData;
if (window.location.pathname === "/rooms") {
  loadData("getrooms", false);
} else {
  loadData("getrooms", true);
}

function loadData(location, needAverage) {
  $.get("/api/" + location, function(data) {
    return data;
  })
    .done(function(data) {
      if (data) {
        roomData = data;
        console.log(roomData);
        needAverage ? getAverage(data) : sortData();
      } else {
        return;
      }
    })
    .fail(function(err) {
      console.log(err);
    });
}

function sortData() {
  if (roomData) {
    for (let i = 0; i < roomData.length; i++) {
      console.log(roomData);
      addHTML(roomData[i]);
    }
  } else {
    console.log("no data");
  }
}

function addHTML(specificRoom) {
  console.log(specificRoom.percent);
  let backgroundcolor = colorCheck(specificRoom.percent);

  let li = $("<li>");
  let a = $("<a>");
  let div = $("<div>");
  let h3 = $("<h3>");
  let percentClean = $("<div>");
  let progressbar = $("<div>");

  h3.text(specificRoom.title);
  percentClean.text(specificRoom.percent + "%");
  percentClean.addClass("percentage-clean");
  progressbar.addClass("progress-bar");
  progressbar.css("width", specificRoom.percent + "%");
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

//get average cleanliness of whole house
function getAverage(data) {
  let percentages = 0;

  for (let i = 0; i < data.length; i++) {
    percentages += data[i].percent;
  }
  return percentages / data.length;
}
