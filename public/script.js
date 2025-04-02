async function fetchUsers() {
  let response = await fetch("/users"); // Calls Express API
  let users = await response.json();
  document.getElementById("user-list").innerHTML = users
    .map((user) => `<li>${user.name} (${user.email})</li>`)
    .join("");
}

async function addUser() {
  try {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate inputs
    if (!name || !email || !password) {
      alert("Name and email and also Password are required!");
      return;
    }

    console.log("Submitting:", { name, email, password });

    const response = await fetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json(); // Always parse JSON

    if (!response.ok) {
      throw new Error(result.error || "Failed to add user");
    }

    console.log("Success:", result);
    fetchUsers(); // Refresh list
  } catch (error) {
    console.error("Error adding user:", error);
    alert(`Error: ${error.message}`);
  }
}

// Load users on page load
fetchUsers();
