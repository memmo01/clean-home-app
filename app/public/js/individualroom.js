let path = window.location.pathname;
let roomdata;
let formsave = [];
let taskToRemove = [];
let chores = [];

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
  console.log(roomdata);
  $(".modal-content").append(noteButton);

  $("#clean-btn-submit").on("click", function(e) {
    e.preventDefault();
    let allcheck = true;
    let formOptions = $("#myform")[0].elements;

    for (let i = 0; i < formOptions.length; i++) {
      if (formOptions[i].checked === false) {
        allcheck = false;
      }
    }
    if (allcheck === true) {
      sendToDatabase();
    }
  });

  function sendToDatabase() {
    console.log(roomdata);
    let now = moment().format("MM/DD/YY");
    let trial = moment()
      .add(5, "days")
      .format("MM/DD/YY");
    let data = {
      last_cleaned: now,
      room_id: roomdata[0].room_id,
      notes: savenotes
    };

    $.post("/api/cleanedroom", data, function() {
      console.log("posted");
    });
  }

  $("#edit-btn").on("click", function(e) {
    e.preventDefault();
    saveData();
    clearDiv("#edit-btn");
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
      clearDiv(
        ".btn-container",
        "#edit-text-btn",
        "textarea",
        ".complete-note-container",
        "#save-btn"
      );

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

    clearDiv("#edit-text-btn", ".complete-note-container");

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

function clearDiv(...div) {
  for (let i = 0; i < div.length; i++) {
    $("" + div[i] + "").remove();
    console.log(div[i]);
  }
}

$("#edit-room-btn").on("click", function(e) {
  e.preventDefault();

  $(".modal").css("display", "block");
  $(".modal-title").text("Edit Room");

  let form = $("<form>", { id: "roomEdit" });
  let modal = $(".modal-body");

  let roomNameEdit = $("<input>", {
    value: roomdata[0].name,
    class: "edit-input",
    id: roomdata[0].name
  });
  let label = $("<label>", {
    for: roomdata[0].name,
    text: "Room Name"
  });
  label.append(roomNameEdit);
  form.append(label);
  modal.append(form);
  let title = $("<h2>", { text: "Tasks to Complete" });

  let daysOption = createOption();
  let ul = createTaskList(roomdata);
  let addTaskBtn = $("<div>", { class: "add-task", html: "Add More Tasks" });
  let savebtn = $("<button>", { text: "save", id: "save-room-update" });

  title.append(ul);
  form.append(title);
  form.append(addTaskBtn);
  form.append(daysOption);
  form.append(savebtn);

  $(".remove-task").on("click", function(e) {
    e.preventDefault();
    taskToRemove.push(
      $(this)
        .closest("li")
        .attr("data-name")

      // will end up moving these to an array . when save is selected, it will take information in the array and delete it from database
    );
    $(this)
      .closest("li")
      .remove();
    console.log(taskToRemove);
  });
});

function createTaskList(data) {
  let ul = $("<ul>", { class: "remove-list-conainer" });
  for (let i = 0; i < roomdata.length; i++) {
    let rmvBtn = $("<button>", { class: "remove-task", html: "&times" });
    console.log("********");

    // push chores to array to manage updates in app
    chores.push(roomdata[i].chore_name);

    let li = $("<li>", {
      class: "remove-list",
      "data-name": roomdata[i].chore_name
    });
    li.text(roomdata[i].chore_name);
    li.prepend(rmvBtn);
    ul.append(li);
  }
  return ul;
}

function createOption() {
  let label = $("<label>", {
    for: "days",
    text: "Number of days before room needs to be cleaned again",
    id: "days-label"
  });
  let select = $("<select>", { id: "days" });
  for (let i = 1; i <= 30; i++) {
    let option = $("<option>", { value: i, text: i });
    select.append(option);
  }
  label.append(select);
  return label;
}

$("#clean-btn").on("click", function(e) {
  e.preventDefault();
  $(".modal").css("display", "block");
  displayCleanCheck(false);
});

$(".close").on("click", function(e) {
  e.preventDefault();
  $("body").css("overflow", "auto");
  clearDiv(
    "textarea",
    "#edit-tet-btn",
    "form",
    ".btn-container",
    ".complete-note-container",
    "#edit-btn"
  );

  $(".modal").css("display", "none");
});
