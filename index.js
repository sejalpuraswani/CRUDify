loadTable();

document.addEventListener("click", (event) => {
  const registerUserModal = document.getElementById("custom-modal");
  const container = document.getElementById("container");

  if (event.target.id === "newUser") {
    container.style.display = "none";
    registerUserModal.style.display = "block";
  } else if (event.target.id === "cancel-btn") {
    registerUserModal.style.display = "none";
    container.style.display = "block";
  } else if (event.target.id === "submit-btn") {
    addUser();
  } else if (event.target.classList.contains("edit-btn")) {
    const userId = event.target.dataset.id;
    editUserDetails(userId);
  } else if (event.target.classList.contains("del-btn")) {
    deleteUser(event.target.dataset.id);
  }
  else if(event.target.id === "select"){
    sortUsers(event.target.value);
  }
});

document.getElementById("searchInput").addEventListener("input", (event) => {
  searchUsers(event.target.value);
});

function addUser() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const dateOfBirth = document.getElementById("dob").value;

  if (!firstName || !lastName || !email || !phone || !dateOfBirth) {
    alert("Please fill in all fields!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  let userId = 1;
  if (users.length > 0) {
    const ids = users.map(user => user.id);
    userId = Math.max(...ids) + 1;
  }

  const newUser = {
    id: userId,
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));
  

  loadTable();

  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("dob").value = "";

  document.getElementById("custom-modal").style.display = "none";
  document.getElementById("container").style.display = "block";
}

function editUserDetails(id) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find((user) => user.id === Number(id));

  document.getElementById("firstName").value = user.firstName;
  document.getElementById("lastName").value = user.lastName;
  document.getElementById("email").value = user.email;
  document.getElementById("phone").value = user.phone;
  document.getElementById("dob").value = user.dateOfBirth;

  document.getElementById("custom-modal").style.display = "block";
  document.getElementById("container").style.display = "none";

  deleteUser(id);
}

function deleteUser(id) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  users = users.filter((user) => user.id !== Number(id));

  localStorage.setItem("users", JSON.stringify(users));

  const deleteButton = document.querySelector(`button[data-id="${id}"]`);
  if (deleteButton) {
    deleteButton.parentElement.parentElement.remove();
  }
}

function sortUsers(sortKey){
  const users = JSON.parse(localStorage.getItem("users")) || [];
  
  users.sort((a,b)=>a[sortKey].localeCompare(b[sortKey]));
 
  localStorage.setItem("users",JSON.stringify(users));

  loadTable();

  
}

function searchUsers(query){
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const searchedQuery = query.toLowerCase();

  const filteredUsers = users.filter((user) => user.firstName.toLowerCase().includes(searchedQuery) || user.lastName.toLowerCase().includes(searchedQuery) || user.email.toLowerCase().includes(searchedQuery));

  loadTable(filteredUsers);
}

function loadTable(filteredUsersList) {
  const users =  Array.isArray(filteredUsersList) ? filteredUsersList : JSON.parse(localStorage.getItem("users")) || [];

  const userTable = document.querySelector("table");

  const existingRows = document.querySelectorAll(".table-row");
  existingRows.forEach((row) => row.remove());

  users.forEach((user, index) => {
    const tableRow = document.createElement("tr");

    const tdSerial = document.createElement("td");
    tdSerial.innerHTML = index + 1;

    const tdFirstName = document.createElement("td");
    tdFirstName.innerHTML = user.firstName;

    const tdLastName = document.createElement("td");
    tdLastName.innerHTML = user.lastName;

    const tdEmail = document.createElement("td");
    tdEmail.innerHTML = user.email;

    const tdPhone = document.createElement("td");
    tdPhone.innerHTML = user.phone;

    const tdDateOfBirth = document.createElement("td");
    tdDateOfBirth.innerHTML = user.dateOfBirth;

    const tdActions = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.setAttribute("data-id", user.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.setAttribute("data-id", user.id);
    deleteBtn.classList.add("del-btn");

    tdActions.appendChild(editBtn);
    tdActions.appendChild(deleteBtn);

    tableRow.appendChild(tdSerial);
    tableRow.appendChild(tdFirstName);
    tableRow.appendChild(tdLastName);
    tableRow.appendChild(tdEmail);
    tableRow.appendChild(tdPhone);
    tableRow.appendChild(tdDateOfBirth);
    tableRow.appendChild(tdActions);

    tableRow.classList.add("table-row");

    userTable.appendChild(tableRow);
  });
}

