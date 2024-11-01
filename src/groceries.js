var btnAdd = document.getElementById('btnAdd');
var btnUpdate = document.getElementById('btnUpdate');
var groceryInput = document.getElementById('groceryInput');
var groceryQuantity = document.getElementById('groceryQuantity'); // New quantity input
var groceryTableBody = document.getElementById('groceryTable').querySelector('tbody');
var SelectCategory = document.getElementById('SelectCategory');
var suggestionsDiv = document.getElementById('suggestions');
var quantityGroup = document.getElementById('quantityGroup');

let currentGroceryIndex = null;

// Suggested ingredients
const categoryItems = {
    fruits: ['Apple', 'Banana', 'Apricot', 'Avocado', 'Blueberry', 'Cranberry', 'Grapefruit', 'Kiwi', 'Lemon', 'Lime', 'Mango', 'Orange', 'Peach', 'Pear', 'Pineapple', 'Plum', 'Raspberry', 'Strawberry', 'Watermelon'],
    vegetables: ['Artichoke', 'Asparagus', 'Beetroot', 'Broccoli', 'Cabbage', 'Carrot', 'Cauliflower', 'Celery', 'Cucumber', 'Eggplant', 'Garlic', 'Green Beans', 'Lettuce', 'Onion', 'Pepper', 'Radish', 'Spinach', 'Tomato', 'Zucchini'],
    dairy: ['Butter', 'Buttermilk', 'Cheese', 'Cream', 'Cream Cheese', 'Greek Yogurt', 'Milk', 'Ricotta'],
    meat: ['Bacon', 'Beef', 'Chicken', 'Duck', 'Goat', 'Lamb', 'Pork', 'Turkey', 'Venison'],
    seafood: ['Clams', 'Crab', 'Fish', 'Mackerel', 'Mussels', 'Oysters', 'Salmon', 'Sardines', 'Shrimp', 'Tuna'],
    grains: ['Barley', 'Basmati Rice', 'Bread', 'Brown Rice', 'Couscous', 'Pasta', 'Quinoa', 'White Rice'],
    legumes: ['Chickpeas', 'Kidney Beans', 'Lentils', 'Peas', 'Pinto Beans', 'Soybeans'],
    nutsAndSeeds: ['Almonds', 'Cashews', 'Chia Seeds', 'Flaxseeds', 'Hazelnuts', 'Peanuts', 'Pine Nuts', 'Walnuts'],
    herbsAndSpices: ['Basil', 'Black Pepper', 'Cayenne Pepper', 'Chili Powder', 'Cinnamon', 'Coriander', 'Dill', 'Garlic Powder', 'Ginger', 'Oregano', 'Parsley', 'Rosemary', 'Sage', 'Thyme', 'Turmeric']
};

// Load grocery list on page load
window.onload = function() {
    loadCategories(); // Load categories if needed
    displayGroceryList(); // Show existing groceries
};

function loadCategories() {
    // Clear existing options
    SelectCategory.innerHTML = '<option value="">-- Select Category --</option>';
    
    const categories = Object.keys(categoryItems); // Get category names
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize category name
        SelectCategory.appendChild(option);
    });
}


// Show suggestions
SelectCategory.addEventListener('change', function() {
    const selectedCategory = this.value;
    suggestionsDiv.innerHTML = ''; // Clear old suggestions
    if (selectedCategory) {
        const items = categoryItems[selectedCategory] || []; // Get items
        const suggestionsList = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.style.cursor = 'pointer';
            li.addEventListener('click', function() {
                // Add item to input
                groceryInput.value += (groceryInput.value ? ', ' : '') + item;
            });
            suggestionsList.appendChild(li);
        });
        suggestionsDiv.appendChild(suggestionsList);
    }
});

// Save to localStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Get from localStorage
function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Show grocery items in the table
function displayGroceryList() {
    const groceryList = getFromLocalStorage('groceryList'); // Fetch grocery list from localStorage
    groceryTableBody.innerHTML = ''; // Clear table
    groceryList.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>
                <button class="btn-delete btn-delete-grocery" data-index="${index}">Delete</button>
                <button class="btn-edit btn-edit-grocery" data-index="${index}">Edit</button>
            </td>
        `;
        groceryTableBody.appendChild(row);
    });

    // Attach event listeners for delete and edit
    attachEventListeners();
}

// Attach event listeners for buttons
function attachEventListeners() {
    document.querySelectorAll('.btn-delete-grocery').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteGroceryItem(index);
        });
    });

    document.querySelectorAll('.btn-edit-grocery').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            editGroceryItem(index);
        });
    });
}

// Add grocery items
btnAdd.addEventListener('click', function() {
    const groceryList = getFromLocalStorage('groceryList');
    const items = groceryInput.value.split(/[\n,]+/).map(item => item.trim()).filter(item => item);
    
    items.forEach(item => {
        const newItem = {
            name: item,
            quantity: 1 // Default quantity
        };
        groceryList.push(newItem);
    });

    saveToLocalStorage('groceryList', groceryList);
    displayGroceryList();
    alert('Grocery items added!');
    groceryInput.value = '';
});

// Delete a grocery item by index
function deleteGroceryItem(index) {
    const groceryList = getFromLocalStorage('groceryList');
    groceryList.splice(index, 1); // Remove item
    saveToLocalStorage('groceryList', groceryList);
    displayGroceryList(); // Refresh table
}

// Edit a grocery item
function editGroceryItem(index) {
    const groceryList = getFromLocalStorage('groceryList');
    const item = groceryList[index];
    groceryInput.value = item.name;
    groceryQuantity.value = item.quantity; // Set quantity
    currentGroceryIndex = index; // Set index for updating
    quantityGroup.style.display = 'block'; // Show quantity input
}

// Update Action
btnUpdate.addEventListener('click', function() {
    if (currentGroceryIndex !== null) {
        const groceryList = getFromLocalStorage('groceryList');
        groceryList[currentGroceryIndex] = {
            name: groceryInput.value,
            quantity: groceryQuantity.value, // Get updated quantity
        };
        saveToLocalStorage('groceryList', groceryList);
        displayGroceryList();
        alert('Grocery item updated!');
        groceryInput.value = '';
        groceryQuantity.value = ''; // Clear quantity input
        currentGroceryIndex = null; // Reset index
        quantityGroup.style.display = 'none'; // Hide quantity input
    }
});
