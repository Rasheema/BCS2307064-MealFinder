const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'; // Base URL for API

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param); // Get URL parameter
}

class CategoryManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    async fetchCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/list.php?c=list`);
            const data = await response.json();
            return data.meals; // Return categories
        } catch (error) {
            console.error('Error fetching categories:', error);
            return []; // Return empty array on error
        }
    }

    renderCategories() {
        this.fetchCategories().then(categories => {
            categories.forEach(category => {
                const card = document.createElement('div');
                card.classList.add('category-card');
                card.innerHTML = `<h3>${category.strCategory}</h3>`;
                card.addEventListener('click', () => {
                    window.location.href = `mealrec.html?category=${encodeURIComponent(category.strCategory)}`; // Redirect on click
                });
                this.container.appendChild(card); // Add card to container
            });
        });
    }
}

class RecipeManager {
    constructor(containerId, titleId) {
        this.container = document.getElementById(containerId);
        this.titleElement = document.getElementById(titleId);
    }

    async fetchRecipesByCategory(category) {
        try {
            const response = await fetch(`${API_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
            const data = await response.json();
            return data.meals.slice(0, 15); // Get ~15 recipes
        } catch (error) {
            console.error('Error fetching recipes:', error);
            return []; // Return empty array on error
        }
    }

    renderRecipes(category) {
        this.titleElement.textContent = `Recipes in "${category}" Category`; // Update title
        this.fetchRecipesByCategory(category).then(recipes => {
            recipes.forEach(recipe => {
                const card = document.createElement('div');
                card.classList.add('recipe-card');
                card.innerHTML = `
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <h3>${recipe.strMeal}</h3>
                `;
                card.addEventListener('click', () => {
                    window.location.href = `displayrecipe.html?mealId=${recipe.idMeal}`; // Redirect to recipe page
                });
                this.container.appendChild(card); // Add recipe card to container
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('categories-container')) {
        const categoryManager = new CategoryManager('categories-container'); // For index.html
        categoryManager.renderCategories();
    }

    if (document.getElementById('recipes-container')) {
        const category = getQueryParam('category'); // Get selected category
        if (category) {
            const recipeManager = new RecipeManager('recipes-container', 'category-title'); // For mealrec.html
            recipeManager.renderRecipes(category);
        } else {
            document.getElementById('category-title').textContent = 'No category selected.'; // Handle no category
        }
    }
});
