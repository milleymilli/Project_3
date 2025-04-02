async function fetchUsers() {
  let response = await fetch("/users"); // Calls Express API
  let users = await response.json();
  document.getElementById("user-list").innerHTML = users
    .map((user) => `<li>${user.name} (${user.email})</li>`)
    .join("");
}

async function addUser() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;

  let response = await fetch("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  if (response.ok) {
    fetchUsers(); // Refresh the user list
  }
}

// Load users on page load
fetchUsers();
