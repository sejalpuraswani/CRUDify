let currentPage = 1;
const rowsPerPage = 5;

document.addEventListener("click", (event) => {
  const registerUserModal = document.getElementById("custom-modal");
  const container = document.getElementById("container");
  const paginContainer = document.getElementById("pagination");

  if (event.target.id === "newUser") {
    paginContainer.style.display = "none";
    container.style.display = "none";
    registerUserModal.style.display = "block";
  } else if (event.target.id === "cancel-btn") {
    registerUserModal.style.display = "none";
    container.style.display = "block";
    paginContainer.style.display = "flex"
  } else if (event.target.id === "submit-btn") {
    addUser();
  } else if (event.target.classList.contains("edit-btn")) {
    const userId = event.target.dataset.id;
    editUserDetails(userId);
  } else if (event.target.classList.contains("del-btn")) {
    deleteUser(event.target.dataset.id);
  } else if (event.target.id === "select") {
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
  let userId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;

  const newUser = { id: userId, firstName, lastName, email, phone, dateOfBirth };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  loadTable();
  resetForm();
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
  document.getElementById("pagination").style.display = "none";

  deleteUser(id);
}

function deleteUser(id) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter((user) => user.id !== Number(id));
  localStorage.setItem("users", JSON.stringify(users));

  loadTable();
}

function sortUsers(sortKey) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  localStorage.setItem("users", JSON.stringify(users));

  loadTable();
}

function searchUsers(query) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const searchedQuery = query.toLowerCase();
  const filteredUsers = users.filter((user) => user.firstName.toLowerCase().includes(searchedQuery) || user.lastName.toLowerCase().includes(searchedQuery) || user.email.toLowerCase().includes(searchedQuery));

  loadTable(filteredUsers);
}

function loadTable(filteredUsersList) {
  const users = Array.isArray(filteredUsersList) ? filteredUsersList : JSON.parse(localStorage.getItem("users")) || [];

  const userTable = document.querySelector("table");

  // Remove existing rows
  const existingRows = document.querySelectorAll(".table-row");
  existingRows.forEach((row) => row.remove());

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + rowsPerPage);

  paginatedUsers.forEach((user, index) => {
    const tableRow = document.createElement("tr");

    // Dynamically create and append each column
    const tdSerial = document.createElement("td");
    tdSerial.innerHTML = startIndex + index + 1;
    tableRow.appendChild(tdSerial);

    const tdFirstName = document.createElement("td");
    tdFirstName.innerHTML = user.firstName;
    tableRow.appendChild(tdFirstName);

    const tdLastName = document.createElement("td");
    tdLastName.innerHTML = user.lastName;
    tableRow.appendChild(tdLastName);

    const tdEmail = document.createElement("td");
    tdEmail.innerHTML = user.email;
    tableRow.appendChild(tdEmail);

    const tdPhone = document.createElement("td");
    tdPhone.innerHTML = user.phone;
    tableRow.appendChild(tdPhone);

    const tdDateOfBirth = document.createElement("td");
    tdDateOfBirth.innerHTML = user.dateOfBirth;
    tableRow.appendChild(tdDateOfBirth);

    const tdActions = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.setAttribute("data-id", user.id);
    tdActions.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.setAttribute("data-id", user.id);
    deleteBtn.classList.add("del-btn");
    tdActions.appendChild(deleteBtn);

    tableRow.appendChild(tdActions);

    tableRow.classList.add("table-row");
    userTable.appendChild(tableRow);
  });

  updatePaginationControls(users.length);
}

function updatePaginationControls(totalUsers) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalUsers / rowsPerPage);

  const prevButton = document.createElement("button");
  prevButton.innerText = "Prev";
  prevButton.classList.add("nav-btn");
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    currentPage--;
    loadTable();
  });
  paginationContainer.appendChild(prevButton);

  const pageButton = document.createElement("button");
  pageButton.innerText = currentPage;
  pageButton.classList.add("currentpage-btn");
  paginationContainer.appendChild(pageButton);


  const nextButton = document.createElement("button");
  nextButton.innerText = "Next";
  nextButton.classList.add("nav-btn");
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    currentPage++;
    loadTable();
  });
  paginationContainer.appendChild(nextButton);
}

function resetForm() {
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("dob").value = "";

  document.getElementById("custom-modal").style.display = "none";
  document.getElementById("container").style.display = "block";
}

document.addEventListener("DOMContentLoaded", loadTable);