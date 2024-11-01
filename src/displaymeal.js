// displaymeal.js

window.onload = function() {
    const mealId = new URLSearchParams(window.location.search).get('mealId');
    if (mealId) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                const name = meal.strMeal;
                const category = meal.strCategory;
                const area = meal.strArea;
                const instructions = meal.strInstructions;
                const imageUrl = meal.strMealThumb;
                const youtubeUrl = meal.strYoutube;
                const categoryDescription = `A popular dish in the ${category} category, known for its flavors from the ${area} region.`;

                // Show meal details
                document.getElementById("demo1").innerHTML = `Menu: ${name}`;
                document.getElementById("demo2").innerHTML = `Category: ${category} | Area: ${area}`;
                document.getElementById("mealImage").src = imageUrl;

                // Show category description
                const categoryDescElement = document.createElement('p');
                categoryDescElement.textContent = categoryDescription;
                document.getElementById("demo2").appendChild(categoryDescElement);

                // Make ingredients list
                let ingredientsList = "<ul>";
                for (let i = 1; i <= 20; i++) {
                    const ingredient = meal[`strIngredient${i}`];
                    const measure = meal[`strMeasure${i}`];
                    if (ingredient && ingredient.trim()) {
                        ingredientsList += `<li>${measure} ${ingredient}</li>`;
                    }
                }
                ingredientsList += "</ul>";
                document.getElementById("demo3").innerHTML = ingredientsList;

                // Format instructions
                const steps = instructions.split(/(?:\. |\n|\r)/);
                let formattedInstructions = "<ol>";
                for (const step of steps) {
                    if (step.trim()) {
                        formattedInstructions += `<li>${step}</li>`;
                    }
                }
                formattedInstructions += "</ol>";
                document.getElementById("demo4").innerHTML = formattedInstructions;

                // YouTube link if it exists
                if (youtubeUrl) {
                    const youtubeElement = document.createElement('a');
                    youtubeElement.href = youtubeUrl;
                    youtubeElement.textContent = "Watch on YouTube";
                    youtubeElement.target = "_blank";
                    youtubeElement.style.display = "block";
                    youtubeElement.style.marginTop = "10px";
                    document.getElementById("demo4").appendChild(youtubeElement);
                }

                // Add to meal planner
                document.getElementById("addToPlanner").addEventListener("click", () => {
                    const ingredients = [];
                    for (let i = 1; i <= 20; i++) {
                        const ingredient = meal[`strIngredient${i}`];
                        const measure = meal[`strMeasure${i}`];
                        if (ingredient && ingredient.trim()) {
                            ingredients.push(`${measure} ${ingredient}`);
                        }
                    }

                    // Store meal name and ingredients together
                    const mealData = {
                        name: name,
                        ingredients: ingredients.join(', ')
                    };
                    localStorage.setItem("selectedMeal", JSON.stringify(mealData));
                    window.location.href = "mealplanner.html";
                });
            })
            .catch(error => {
                console.error("Oops! Error fetching recipe:", error);
                document.getElementById("demo1").innerHTML = "An error occurred while fetching the recipe.";
            });
    }
};
