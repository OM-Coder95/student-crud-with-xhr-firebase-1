const cl = console.log;

const studentsContainer = document.getElementById("studentsContainer");
const spinner = document.getElementById("spinner");
const form = document.getElementById("form");
const first_nameControl = document.getElementById("first_name");
const last_nameControl = document.getElementById("last_name");
const emailControl = document.getElementById("email");
const contactControl = document.getElementById("contact");
const addStudentBtn = document.getElementById("addStudentBtn");
const updateStudentBtn = document.getElementById("updateStudentBtn");

let BASE_URL = `https://xhr-firebase-crud-default-rtdb.firebaseio.com`;

let STUDENT_URL = `${BASE_URL}/students.json`;

let studentArray = [];

// Read

function showOnUI() {
  let xhr = new XMLHttpRequest();

  xhr.open("GET", STUDENT_URL);

  spinner.classList.remove("d-none");

  xhr.send(null);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let res = JSON.parse(xhr.response);
      cl(res);

      for (const key in res) {
        res[key].id = key;
        studentArray.unshift(res[key]);
      }

      templating(studentArray);
      spinner.classList.add("d-none");
    } else {
      spinner.classList.add("d-none");
      Swal.fire({
        title: "Something went wrong!",
        text: `Request failed with status ${xhr.status}`,
        icon: "error",
        timer: 1800,
      });
    }
  };

  xhr.onerror = function () {
    spinner.classList.add("d-none");

    Swal.fire({
      title: "Network Error!",
      text: "Unable to connect to the server.",
      icon: "error",
    });
  };
}

showOnUI();

function templating(arr) {
  let result = "";

  arr.forEach((ele, i) => {
    result += `
 <tr id="${ele.id}">
                                    <td>${i + 1}</td>
                                    <td>${ele.fname}</td>
                                    <td>${ele.lname}</td>
                                    <td>${ele.email}</td>
                                    <td>${ele.contact}</td>
                                    <td class="d-flex justify-content-between">
                                        <button onclick="editStudent(this)" class="btn btn-sm btn-primary editBtn">Edit</button>
                                        <button onclick="removeStudent(this)" class="btn btn-sm btn-danger deleteBtn">Delete</button>
                                    </td>
                                </tr> 
        `;
  });

  studentsContainer.innerHTML = result;
}

// Create

function onStudentAdd(event) {
  event.preventDefault();

  // Validation

  if (
    !first_nameControl.value.trim() ||
    !last_nameControl.value.trim() ||
    !emailControl.value.trim() ||
    !contactControl.value.trim()
  ) {
    Swal.fire({
      title: "All Fields Required!",
      text: "Please fill in all the fields.",
      icon: "warning",
    });
    return;
  }

  let newStudent = {
    fname: first_nameControl.value.trim(),
    lname: last_nameControl.value.trim(),
    email: emailControl.value.trim(),
    contact: contactControl.value.trim(),
  };

  let xhr = new XMLHttpRequest();

  xhr.open("POST", STUDENT_URL);

  spinner.classList.remove("d-none");

  xhr.send(JSON.stringify(newStudent));

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let res = JSON.parse(xhr.response);
      cl(res);

      createTr(res, newStudent);

      Swal.fire({
        title: "Student Added!",
        text: "Student has been added successfully.",
        icon: "success",
        timer: 1500,
      });

      spinner.classList.add("d-none");
    } else {
      spinner.classList.add("d-none");
      Swal.fire({
        title: "Something went wrong",
        text: `Request failed with status ${xhr.status}`,
        icon: "error",
        timer: 1800,
      });
    }
  };

  xhr.onerror = function () {
    spinner.classList.add("d-none");

    Swal.fire({
      title: "Network Error!",
      text: "Unable to connect to the server.",
      icon: "error",
      timer: 1800,
    });
  };
}

// createTr

function createTr(res, newStudent) {
  let tr = document.createElement("tr");

  tr.id = res.name;

  tr.innerHTML = `
    <td>1</td>
    <td>${newStudent.fname}</td>
    <td>${newStudent.lname}</td>
    <td>${newStudent.email}</td>
    <td>${newStudent.contact}</td>
    <td class="d-flex justify-content-between">
        <button onclick="editStudent(this)" class="btn btn-sm btn-primary editBtn">Edit</button>
        <button onclick="removeStudent(this)" class="btn btn-sm btn-danger deleteBtn">Delete</button>
    </td>
    `;
  studentsContainer.prepend(tr);

  let srno = document.querySelectorAll(`#studentsContainer tr td:first-child`);

  srno.forEach((ele, i) => (ele.innerText = i + 1));
  form.reset();
}

// Edit

function editStudent(ele) {
  let editId = ele.closest("tr").id;
  localStorage.setItem("editId", editId);

  let xhr = new XMLHttpRequest();

  xhr.open("GET", `${BASE_URL}/students/${editId}.json`);

  spinner.classList.remove("d-none");

  xhr.send(null);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let res = JSON.parse(xhr.response);
      cl(res);

      first_nameControl.value = res.fname;
      last_nameControl.value = res.lname;
      emailControl.value = res.email;
      contactControl.value = res.contact;

      addStudentBtn.classList.add("d-none");
      updateStudentBtn.classList.remove("d-none");

      // disable deleteBtn

      let tr = document.getElementById(editId);
      let deleteBtn = tr.querySelector(".deleteBtn");
      deleteBtn.disabled = true;

      spinner.classList.add("d-none");
    } else {
      spinner.classList.add("d-none");
      Swal.fire({
        title: "Something went wrong",
        text: `Request failed with status ${xhr.status}`,
        icon: "error",
        timer: 1800,
      });
    }
  };

  xhr.onerror = function () {
    spinner.classList.add("d-none");

    Swal.fire({
      title: "Network Error!",
      text: "Unable to connect to the server.",
      icon: "error",
      timer: 1800,
    });
  };
}

// Update

function onUpdateClick(event) {
  let updateId = localStorage.getItem("editId");

  // Validation

  if (
    !first_nameControl.value.trim() ||
    !last_nameControl.value.trim() ||
    !emailControl.value.trim() ||
    !contactControl.value.trim()
  ) {
    Swal.fire({
      title: "All Fields Required!",
      text: "Please fill in all the fields.",
      icon: "warning",
    });
    return;
  }

  let updatedObj = {
    fname: first_nameControl.value.trim(),
    lname: last_nameControl.value.trim(),
    email: emailControl.value.trim(),
    contact: contactControl.value.trim(),
  };

  let UPDATE_URL = `${BASE_URL}/students/${updateId}.json`;

  let xhr = new XMLHttpRequest();

  xhr.open("PATCH", UPDATE_URL);

  spinner.classList.remove("d-none");

  xhr.send(JSON.stringify(updatedObj));

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let res = JSON.parse(xhr.response);

      let td = [...document.getElementById(updateId).children];

      td[1].innerText = first_nameControl.value.trim();
      td[2].innerText = last_nameControl.value.trim();
      td[3].innerText = emailControl.value.trim();
      td[4].innerText = contactControl.value.trim();

      updateStudentBtn.classList.add("d-none");
      addStudentBtn.classList.remove("d-none");
      localStorage.removeItem("editId");
      form.reset();

      // enable deleteBtn

      let tr = document.getElementById(updateId);
      let deleteBtn = tr.querySelector(".deleteBtn");
      deleteBtn.disabled = false;

      Swal.fire({
        title: "Updated!",
        text: "Student has been updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      spinner.classList.add("d-none");
    } else {
      spinner.classList.add("d-none");
      Swal.fire({
        title: "Something went wrong",
        text: `Request failed with status ${xhr.status}`,
        icon: "error",
        timer: 1800,
      });
    }
  };

  xhr.onerror = function () {
    spinner.classList.add("d-none");

    Swal.fire({
      title: "Network Error!",
      text: "Unable to connect to the server.",
      icon: "error",
      timer: 1800,
    });
  };
}

// Remove

function removeStudent(ele) {
  let removeId = ele.closest("tr").id;

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let REMOVE_URL = `${BASE_URL}/students/${removeId}.json`;

      let xhr = new XMLHttpRequest();

      xhr.open("DELETE", REMOVE_URL);

      spinner.classList.remove("d-none");

      xhr.send(null);

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
          let res = JSON.parse(xhr.response);
          cl(res);

          ele.closest("tr").remove();

          let srno = document.querySelectorAll(
            `#studentsContainer tr td:first-child`,
          );

          Swal.fire({
            title: "Deleted!",
            text: "Student has been deleted successfully.",
            icon: "success",
            timer: 1500,
          });

          srno.forEach((ele, i) => (ele.innerText = i + 1));
          form.reset();

          spinner.classList.add("d-none");
        } else {
          spinner.classList.add("d-none");
          Swal.fire({
            title: "Something went wrong",
            text: `Request failed with status ${xhr.status}`,
            icon: "error",
            timer: 1800,
          });
        }
      };

      xhr.onerror = function () {
        spinner.classList.add("d-none");

        Swal.fire({
          title: "Network Error!",
          text: "Unable to connect to the server.",
          icon: "error",
          timer: 1800,
        });
      };
    }
  });
}

form.addEventListener("submit", onStudentAdd);
updateStudentBtn.addEventListener("click", onUpdateClick);
