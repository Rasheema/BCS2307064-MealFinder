function buttonSearch() {
    const category = document.getElementById("category_input").value; // Get category input
    const ingredient = document.getElementById("ingredient_input").value; // Get ingredient input

    const categoryUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`; // Category API URL
    const ingredientUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`; // Ingredient API URL

    Promise.all([fetch(categoryUrl), fetch(ingredientUrl)])
        .then(responses => Promise.all(responses.map(response => response.json()))) // Fetch both URLs
        .then(data => {
            const categoryMeals = data[0].meals || []; // Get meals from category
            const ingredientMeals = data[1].meals || []; // Get meals from ingredient

            const commonMeals = categoryMeals.filter(meal => // Find common meals
                ingredientMeals.some(ingMeal => ingMeal.idMeal === meal.idMeal)
            );

            displayResults(commonMeals); // Show results
        })
        .catch(error => console.error('Error fetching data:', error)); // Handle errors
}

function fetchMealIngredients(mealId) {
    const mealUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    return fetch(mealUrl)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                if (meal[`strIngredient${i}`]) {
                    ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
                }
            }
            return ingredients.join(', ');
        });
}

function displayResults(meals) {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = ''; // Clear previous results

    if (meals.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>'; // No meals found
        return;
    }

    meals.slice(0, 15).forEach(meal => { // Limit to 15 meals
        const mealCard = document.createElement("div");
        mealCard.className = "result-card";
        mealCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <h4>${meal.strMeal}</h4>
        `;

        mealCard.addEventListener("click", () => {
            fetchMealIngredients(meal.idMeal).then(ingredients => {
                const recipe = {
                    name: meal.strMeal,
                    ingredients: ingredients
                };
                localStorage.setItem('selectedMeal', JSON.stringify(recipe));
                window.location.href = `displayrecipe.html?mealId=${meal.idMeal}`; // Redirect to recipe page
            });
        });

        resultsContainer.appendChild(mealCard); // Add meal card to results
    });
}
