console.log(window.location.pathname);
let path = window.location.pathname;
let roomdata;
let formsave = [];

// when notes are created, it will be stored in save names variable
let savenotes;

function savedInput(check, name) {
  this.checked = check;
  this.chore_name = name;
}

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
function displayCleanCheck(savecheck) {
  $("body").css("overflow", "hidden");
  let data;
  if (savecheck === false) {
    data = roomdata;
  } else if (savecheck === true) {
    data = formsave;
  }

  let form = $("<form>", { id: "myform" });
  let modal = $(".modal-body");

  for (let i = 0; i < data.length; i++) {
    let inputdata = createCheckbox(data[i]);
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
  $(".modal-title").text("Cleaning Check List");
  form.append(noteButton);
  form.append(cleanButton);
  modal.append(form);

  $("#edit-btn").on("click", function(e) {
    e.preventDefault();
    saveData();
    loadNoteTaker();

    //buttons for "cancel" and "save notes"
    let btnContainer = $("<div>", { class: "btn-container" });
    let cancel = $("<img>", {
      alt: "notepad",
      src: "/icons/back-btn.png",
      class: "action-icon",
      id: "cancel-btn"
    });
    let save = $("<img>", {
      alt: "notepad",
      src: "/icons/save2.png",
      class: "action-icon",
      id: "save-btn"
    });
    btnContainer.append(cancel);
    btnContainer.append(save);
    $(".modal-content").append(btnContainer);

    $("#cancel-btn").on("click", function(e) {
      e.preventDefault();
      clearDiv(".btn-container");
      clearDiv("#edit-text-btn");
      clearDiv("textarea");
      clearDiv(".complete-note-container");
      displayCleanCheck(true);
    });

    $("#save-btn").on("click", function(e) {
      e.preventDefault();
      savenotes = $("textarea").val();
      completeNotes();
      clearDiv("textarea");
    });
  });
}

function completeNotes() {
  let div = $("<div>", { class: "complete-note-container" });
  div.append(savenotes);
  $(".modal-content").append(div);
  let edit = $("<img>", {
    alt: "pencil",
    src: "/icons/edit.png",
    class: "action-icon",
    id: "edit-text-btn"
  });
  clearDiv("#save-btn");
  $(".modal-content").append(edit);

  $("#edit-text-btn").on("click", function(e) {
    e.preventDefault();

    let save = $("<img>", {
      alt: "save disk",
      src: "/icons/save2.png",
      class: "action-icon",
      id: "save-btn"
    });

    clearDiv("#edit-text-btn");
    clearDiv(".complete-note-container");
    loadNoteTaker();
    $(".modal-content").append(save);
    $("#save-btn").on("click", function(e) {
      e.preventDefault();
      savenotes = $("textarea").val();
      completeNotes();
      clearDiv("textarea");
    });
  });
}

function loadNoteTaker() {
  $("form").remove();
  $(".modal-body").append(createTextbox());
  $(".modal-title").text("Notes");
}
function createTextbox() {
  let textarea = $("<textarea>", {
    rows: "20",
    style: "width:90%;display:block;margin:30px auto 0;"
  });
  textarea.val(savenotes);
  return textarea;
}

function createCheckbox(data) {
  let checked = false;
  if (data.checked) {
    checked = data.checked;
  }
  let label = $("<label>", {
    for: "" + data.chore_name + "",
    text: "" + data.chore_name + "",
    class: "container"
  });
  let input = $("<input/>", {
    type: "checkbox",
    name: "" + data.chore_name + "",
    id: "" + data.chore_name + "",
    checked: checked
  });

  let span = $("<span>").addClass("checkmark");
  label.append(input);
  label.append(span);
  return label;
}

//saves data using constructor and push to a array
function saveData() {
  formsave = [];
  let formOptions = $("#myform")[0].elements;
  for (let i = 0; i < formOptions.length; i++) {
    let obj = new savedInput(formOptions[i].checked, formOptions[i].name);
    formsave.push(obj);
  }
  console.log(formsave);
}

//create a clearing div function

function clearDiv(div) {
  $("" + div + "").remove();
}

$("#clean-btn").on("click", function(e) {
  e.preventDefault();
  $(".modal").css("display", "block");
  displayCleanCheck(false);
});

$(".close").on("click", function(e) {
  e.preventDefault();
  $("body").css("overflow", "auto");
  $("textarea").remove();
  $("#edit-text-btn").remove();
  $("form").remove();
  $(".btn-container").remove();
  $(".complete-note-container").remove();

  $(".modal").css("display", "none");
});
