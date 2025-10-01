// Replace with your Spoonacular API key
const API_KEY = "daf15c65c53b485caabc1a5db24afed8";

const recipeContainer = document.getElementById("recipes");
const searchBtn = document.getElementById("searchBtn");
const ingredientInput = document.getElementById("ingredientInput");

const modal = document.getElementById("recipeModal");
const closeModal = document.getElementById("closeModal");
const modalBody = document.getElementById("modalBody");

searchBtn.addEventListener("click", () => {
  const ingredients = ingredientInput.value.trim();
  if (!ingredients) {
    alert("Please enter some ingredients!");
    return;
  }
  fetchRecipes(ingredients);
});

async function fetchRecipes(ingredients) {
  recipeContainer.innerHTML = "<p>Loading recipes...</p>";
  
  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=9&apiKey=${API_KEY}`
    );
    const data = await res.json();

    if (data.length === 0) {
      recipeContainer.innerHTML = "<p>No recipes found. Try different ingredients.</p>";
      return;
    }

    displayRecipes(data);
  } catch (error) {
    recipeContainer.innerHTML = "<p>Error fetching recipes. Check API key or internet.</p>";
    console.error(error);
  }
}

function displayRecipes(recipes) {
  recipeContainer.innerHTML = "";
  recipes.forEach(recipe => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>✅ Used: ${recipe.usedIngredientCount} | ❌ Missing: ${recipe.missedIngredientCount}</p>
      <button onclick="fetchRecipeDetails(${recipe.id})">View Details</button>
    `;

    recipeContainer.appendChild(recipeCard);
  });
}

// Fetch full recipe details
async function fetchRecipeDetails(id) {
  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
    );
    const recipe = await res.json();

    modalBody.innerHTML = `
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" width="100%" style="border-radius:10px; margin:10px 0;">
      <p><b>Ready in:</b> ${recipe.readyInMinutes} mins | <b>Servings:</b> ${recipe.servings}</p>
      <h3>Ingredients:</h3>
      <ul>${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("")}</ul>
      <h3>Instructions:</h3>
      <p>${recipe.instructions || "No instructions provided."}</p>
    `;

    modal.style.display = "block";
  } catch (error) {
    alert("Error fetching recipe details");
    console.error(error);
  }
}

// Close modal
closeModal.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
