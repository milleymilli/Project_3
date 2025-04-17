// First, properly define all DOM elements
const logo = document.querySelector(".logo");
const navLogin = document.getElementById("nav-login");
const navRegister = document.getElementById("nav-register");
const heroSection = document.querySelector(".hero");
const authSection = document.getElementById("auth-section");
const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// Logo click - scroll to hero
logo.addEventListener("click", (e) => {
  e.preventDefault();
  heroSection.scrollIntoView({ behavior: "smooth" });
});

// Nav Login click - show login form and scroll
navLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  authSection.scrollIntoView({ behavior: "smooth" });
});

// Nav Register click - show register form and scroll
navRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginContainer.classList.add("hidden");
  registerContainer.classList.remove("hidden");
  authSection.scrollIntoView({ behavior: "smooth" });
});

// Form toggle buttons
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginContainer.classList.add("hidden");
  registerContainer.classList.remove("hidden");
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
});

// Animation function (optional)
async function animateFormSwitch(hideEl, showEl) {
  return new Promise((resolve) => {
    hideEl.style.opacity = "0";
    setTimeout(() => {
      hideEl.classList.add("hidden");
      showEl.classList.remove("hidden");
      showEl.style.opacity = "0";
      requestAnimationFrame(() => {
        showEl.style.opacity = "1";
        resolve();
      });
    }, 300);
  });
}
// Toggle between forms
async function handleFormToggle() {
  showRegister.addEventListener("click", async () => {
    await animateFormSwitch(loginContainer, registerContainer);
    document.getElementById("register-name").focus();
  });

  showLogin.addEventListener("click", async () => {
    await animateFormSwitch(registerContainer, loginContainer);
    document.getElementById("login-email").focus();
  });
}

document.addEventListener("DOMContentLoaded", () => {});
// Handle login
async function handleLogin(event) {
  event.preventDefault();

  // Get elements with proper IDs (fixed typo in "password")
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const submitBtn = event.target.querySelector('button[type="submit"]');

  // Validate elements exist
  if (!email || !password || !submitBtn) {
    console.error("Form elements not found!");
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    // Request with timeout
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
      credentials: "include", // For cookie-based auth
    });

    // Check for HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    const data = await response.json();

    // Only redirect if we have a valid token
    if (!data.token) {
      throw new Error("No token received");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "/index.html";
  } catch (err) {
    console.error("Auth Error:", err);
    alert(
      `Login failed: ${
        err.message.includes("NetworkError")
          ? "Cannot connect to server. Check your network."
          : err.message
      }`
    );
    localStorage.removeItem("token", "user");
    return; // Prevent further execution
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Log In";
  }
}

// Wait for DOM to load before attaching event listener

// Handle registration
async function handleRegistration(event) {
  event.preventDefault();
  const submitBtn = event.target.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm").value;

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("register-name").value,
        email: document.getElementById("register-email").value,
        password: password,
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    await animateFormSwitch(registerContainer, loginContainer);
    alert("Registration successful! Please login.");
  } catch (err) {
    console.error("Registration error:", err);
    alert(err.message || "Registration failed");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Register";
  }
}

// Initialize the application
async function initApp() {
  await handleFormToggle();
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  } else {
    console.error("Login form not found!");
  }
  registerForm.addEventListener(
    "submit",
    async (e) => await handleRegistration(e)
  );

  // Focus first input after short delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  document.getElementById("login-email").focus();
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
// Start the application
(async function () {
  await initApp();
})();
fetchRecipes();
