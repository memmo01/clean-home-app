console.log(window.location.pathname);
let path = window.location.pathname;
let roomdata;
$.get("/api" + path, function(data) {}).done(function(data) {
  //save data for future use on page
  roomdata = data;
  constructClientView(data);
});

function constructClientView(data) {
  $("#room-name").text(data[0].name);
  let imgg = data[0].img.split("..");
  $(".banner").css("background-image", "url('" + imgg[1] + "')");
}

// display a check list of items to complete to make the room clean
function displayCleanCheck() {
  $("body").css("overflow", "hidden");

  let form = $("<form>");
  let modal = $(".modal-body");

  for (let i = 0; i < roomdata.length; i++) {
    let inputdata = createCheckbox(roomdata[i]);
    form.append(inputdata);
  }
  let noteButton = $("<img>", {
    alt: "notepad",
    src: "/icons/notepad.png",
    class: "action-icon",
    id: "edit-btn"
  });
  let cleanButton = $("<img>", {
    alt: "notepad",
    src: "/icons/clean.png",
    class: "action-icon",
    id: "clean-btn-submit"
  });
  form.append(noteButton);
  form.append(cleanButton);
  modal.append(form);
}

function createCheckbox(data) {
  let label = $("<label>", {
    for: "" + data.chore_name + "",
    text: "" + data.chore_name + "",
    class: "container"
  });
  let input = $("<input/>", {
    type: "checkbox",
    name: "" + data.chore_name + "",
    id: "" + data.chore_name + ""
  });

  let span = $("<span>").addClass("checkmark");
  label.append(input);
  label.append(span);
  return label;
}

//create a clearing div function

function clearDiv(div) {
  $("" + div + "").empty();
}

$("#clean-btn").on("click", function(e) {
  e.preventDefault();
  $(".modal").css("display", "block");
  displayCleanCheck();
});

$(".close").on("click", function(e) {
  e.preventDefault();
  $("body").css("overflow", "auto");

  $("form").remove();

  $(".modal").css("display", "none");
});
