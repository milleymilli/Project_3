const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

mobileMenu.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

document.getElementById("logout-link").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    // 1. Invalidate token on server
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token", "user")}`,
      },
    });

    // 2. Nuclear client-side cleanup
    localStorage.clear();
    sessionStorage.clear();

    // 3. Redirect with cache busting and history wipe
    window.location.replace(`/login.html?nocache=${Date.now()}`);

    // 4. Service worker cleanup (if applicable)
    if ("caches" in window) {
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
    }
  } catch (err) {
    console.error("Logout error:", err);
    // Fallback cleanup
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login.html";
  }
});

//DISPLAYING ALL OUR USERS
async function fetchUsers() {
  let response = await fetch("/api/users");
  let users = await response.json(); //Why are we using JSON HERE when  we are already using it in the backend????
  document.getElementById("user-list").innerHTML = users
    .map((user) => `<li>${user.name} (${user.email})</li>`)
    .join("");
}

//ADDING NEW USERS
async function addUser() {
  //console.log("Submit button has been clicked");
  const form = document.getElementById("user-form");
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

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json(); // Always parse JSON

    if (!response.ok) {
      throw new Error(result.error || "Failed to add user");
    }
    form.reset(); // 🎉 Clear all fields on success
    alert(`${name} successfully Registered!`);
    console.log("Success:", result);
    fetchUsers(); // Refresh list
  } catch (error) {
    console.error("Error adding user:", error.message);
    alert(`Error: ${error.message}`);
  }
}

//FETCHING ALL OUR RECIPES AND CREATTING RECIPE CARD FOR EACH AND ONE OF THEM
async function fetchRecipes() {
  try {
    let respo = await fetch("/api/recipes"); // Calls Recipes Express API
    let recipes = await respo.json();
    const container = document.getElementById("recipes-container");
    // container.innerHTML = "";
    recipes.map((recipe) => container.appendChild(createRecipeCard(recipe)));
  } catch (err) {
    console.error("Failed to load recipes:", err);
  }
}

// RECIPE CARDS
function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";

  card.innerHTML = `
      <h3>${recipe.name}</h3>
      <p>${recipe.type} Dish</p>
      <button onclick="viewRecipe(${recipe.rid})">View Recipe</button>
    `;

  return card;
}

//CREATING NEW RECIPE
document
  .getElementById("add-recipe-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Adding Recipe...";

    try {
      const recipeData = {
        name: document.getElementById("recipe-name").value.trim(),
        description: document.getElementById("recipe-description").value.trim(),
        type: document.getElementById("recipe-type").value,
        Cookingtime: parseInt(document.getElementById("cooking-time").value),
        ingredients: document
          .getElementById("recipe-ingredients")
          .value.split("\n")
          .filter((line) => line.trim() !== "")
          .join(", "),
        instructions: document
          .getElementById("recipe-instructions")
          .value.split("\n")
          .filter((line) => line.trim() !== "")
          .join(", "),
        image: document.getElementById("recipe-image").value.trim() || null,
      };

      // Validate required fields
      if (
        !recipeData.name ||
        !recipeData.description ||
        !recipeData.type ||
        !recipeData.Cookingtime ||
        !recipeData.ingredients ||
        !recipeData.instructions
      ) {
        throw new Error("All required fields must be filled");
      }

      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add recipe");
      }

      alert("Recipe added successfully!");
      form.reset();
      fetchRecipes(); // Refresh the recipe list
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Add Recipe";
    }
  });
//CREATING A MODAL DISPALYING THE RECIPE DETAILS
async function viewRecipe(rid) {
  const modal = document.getElementById("recipeModal");
  const span = document.getElementsByClassName("close-modal")[0];

  span.onclick = function () {
    modal.style.display = "none";
  };
  //console.log("Clicked - Recipe ID:", rid);
  try {
    let response = await fetch(`/api/recipes/${rid}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }
    let recipeInfo = await response.json(); //Why are we using JSON HERE when  we are already using it in the backend????
    if (!recipeInfo.success) {
      throw new Error(recipeInfo.error);
    }

    const recipe = recipeInfo.data;
    console.log("Received recipe:", recipe[0]);

    document.getElementById("modalRecipeName").textContent = recipe[0].name;
    document.getElementById("modalRecipeAuthor").textContent =
      recipe[0].author || "NotKnown";

    const ingredients = recipe[0].ingredients
      .split(",")
      .map((item) => item.trim());
    const instructions = recipe[0].instructions
      .split(/\d+\./) // Split by "1.", "2.", etc.
      .map((step) => step.trim()) // Remove extra spaces
      .filter((step) => step); // Remove empty items

    const ingredientsList = document.getElementById("modalRecipeIngredients");
    const instructionsList = document.getElementById("modalRecipeInstructions");

    ingredientsList.innerHTML = "";
    instructionsList.innerHTML = "";

    // ADDING INGREDIENTSAND INSTRUCTIONS OF THE RECIPE
    ingredientsList.innerHTML = ingredients
      .map((ing) => `<li>${ing}</li>`)
      .join("");

    instructionsList.innerHTML = instructions
      .map((ins) => `<li>${ins}</li>`)
      .join("");

    // DISSPLAYING THE MODAL
    modal.style.display = "block";
  } catch (error) {
    console.error("Full error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    alert(`Error: ${error.message}\nSee console for details`);
  }
}

// SEARCH RECIPES BY TYPE OR NAME
document.getElementById("recipeSearch").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".recipe-card");
  let anyVisible = false;

  cards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    const type = card.querySelector("p").textContent.toLowerCase(); // Assuming type is in first <p>

    const matches = name.includes(searchTerm) || type.includes(searchTerm);
    card.style.display = matches ? "block" : "none";
    if (matches) anyVisible = true;
  });

  document.getElementById("noRecipes").style.display = anyVisible
    ? "none"
    : "block";
});

// CLEARING SEARCH FIELD
function clearSearch() {
  document.getElementById("recipeSearch").value = "";
  document.querySelectorAll(".recipe-card").forEach((card) => {
    card.style.display = "block";
  });
  document.getElementById("noRecipes").style.display = "none";
}
// I am Loading all the default pages
fetchUsers();
fetchRecipes();
