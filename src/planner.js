const btnCreate = document.getElementById('btnCreate');
const btnRead = document.getElementById('btnRead');
const btnUpdate = document.getElementById('btnUpdate');
const mealName = document.getElementById('mealName');
const mealDate = document.getElementById('mealDate');
const mealType = document.getElementById('mealType');
const plannerTableBody = document.getElementById('plannerTable').querySelector('tbody');
const savedRecipesTableBody = document.getElementById('savedRecipesTable').querySelector('tbody');

// Load meals and saved recipes on page load
window.onload = function() {
    displayMeals(); // Show meals in planner
    displaySavedRecipes(); // Show saved recipes
};

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data)); // Save data to local storage
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : []; // Get data from local storage
}

function displayMeals() {
    const meals = getFromLocalStorage('mealPlanner');
    plannerTableBody.innerHTML = ''; // Clear table
    meals.forEach((meal, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${meal.name}</td>
            <td>${meal.date}</td>
            <td>${meal.type}</td>
            <td>
                <button class="btn-display-meal" data-index="${index}">Display</button>
                <button class="btn-delete-meal" data-index="${index}">Delete</button>
            </td>
        `;
        plannerTableBody.appendChild(row); // Add row to table
    });

    document.querySelectorAll('.btn-display-meal').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            displayMeal(index); // Show selected meal
        });
    });

    document.querySelectorAll('.btn-delete-meal').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteMeal(index); // Delete meal
        });
    });
}

function displayMeal(index) {
    const meals = getFromLocalStorage('mealPlanner');
    const meal = meals[index];
    mealName.value = meal.name;
    mealDate.value = meal.date;
    mealType.value = meal.type; // Set meal details in form
}

function deleteMeal(index) {
    const meals = getFromLocalStorage('mealPlanner');
    meals.splice(index, 1); // Remove meal
    saveToLocalStorage('mealPlanner', meals);
    displayMeals(); // Refresh table
}

function displaySavedRecipes() {
    const savedRecipes = getFromLocalStorage('savedRecipes');
    savedRecipesTableBody.innerHTML = ''; // Clear table
    savedRecipes.forEach((recipe, index) => {
        const recipeData = JSON.parse(recipe); // Parse the recipe data

        // Extract the name and ingredients directly
        const recipeName = recipeData.name;
        const ingredients = recipeData.ingredients; // Assuming ingredients are stored as a string

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${recipeName}</strong><br>
                <small><em>Ingredients:</em><br>${ingredients.replace(/"/g, '').replace(/{|}/g, '')}</small>
            </td>
            <td>
                <button class="btn-delete-recipe" data-index="${index}">Delete</button>
            </td>
        `;
        savedRecipesTableBody.appendChild(row); // Add row to table
    });

    document.querySelectorAll('.btn-delete-recipe').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteSavedRecipe(index); // Delete saved recipe
        });
    });
}

function deleteSavedRecipe(index) {
    const savedRecipes = getFromLocalStorage('savedRecipes');
    savedRecipes.splice(index, 1); // Remove saved recipe
    saveToLocalStorage('savedRecipes', savedRecipes);
    displaySavedRecipes(); // Refresh table
}

btnCreate.addEventListener('click', function() {
    const meals = getFromLocalStorage('mealPlanner');
    const newMeal = {
        name: mealName.value,
        date: mealDate.value,
        type: mealType.value,
    };
    meals.push(newMeal); // Add new meal
    saveToLocalStorage('mealPlanner', meals);
    displayMeals(); // Refresh table
    alert('Meal added to planner');
    mealName.value = ''; // Clear input
    mealDate.value = ''; // Clear input
    mealType.value = 'breakfast'; // Reset meal type
});

// Check for selected recipe from displayrecipe.html
window.addEventListener('load', () => {
    const selectedRecipe = localStorage.getItem('selectedMeal');
    if (selectedRecipe) {
        const savedRecipes = getFromLocalStorage('savedRecipes');
        savedRecipes.push(selectedRecipe); // Add selected recipe to saved
        saveToLocalStorage('savedRecipes', savedRecipes);
        displaySavedRecipes(); // Refresh saved recipes table
        localStorage.removeItem('selectedMeal'); // Clean up
    }
});