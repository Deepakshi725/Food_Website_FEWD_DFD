document.addEventListener('DOMContentLoaded', () => {
    const mealContainer = document.getElementById('mealContainer');
    const mealImage = document.getElementById('mealImage');
    const mealName = document.getElementById('mealName');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    const ingredientList = document.getElementById('ingredientList');
    const instructions = document.getElementById('instructions');
    const searchForm = document.querySelector('.search');
    const recentlySearched = document.getElementById('recentlySearched');
    const recentlySearchedContainer = document.getElementById('recentlySearchedContainer');
    const categoryLabel = document.getElementById('categoryLabel');

    // Stack to store recently searched items
    let recentItems = [];

    // Fetch random meal on page load
    fetchRandomMeal();

    // Fetch a random meal from the API
    function fetchRandomMeal() {
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                displayRandomMeal(meal);
            })
            .catch(error => console.log('Error fetching random meal:', error));
    }

    // Display random meal
    function displayRandomMeal(meal) {
        mealImage.src = meal.strMealThumb;
        mealName.textContent = meal.strMeal;
        mealContainer.addEventListener('click', () => {
            displayModalContent(meal);
        });
    }

    // Display modal with meal ingredients and recipe
    function displayModalContent(meal) {
        modal.style.display = 'block';
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal['strIngredient' + i];
            const measure = meal['strMeasure' + i];
            if (ingredient && measure) {
                ingredients.push(`${ingredient} - ${measure}`);
            }
        }
        ingredientList.innerHTML = ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
        instructions.textContent = meal.strInstructions;
    }

    // Close modal when close button is clicked
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Show recently searched foods when search form is submitted
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchInput = searchForm.querySelector('input[type="search"]');
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            if (searchTerm.length === 1) {
                // Call function to fetch meals by first letter
                fetchMealsByFirstLetter(searchTerm);
                recentlySearched.style.display = 'block';
                displayCategoryLabel(`Searched: Meals starting with "${searchTerm.toUpperCase()}"`); // Display category label
            } else {
                // Call function to fetch search results based on meal name
                fetchSearchResultsByName(searchTerm);
                recentlySearched.style.display = 'block';
                displayCategoryLabel(`Searched: ${searchTerm}`); // Display category label
            }
        }
    });

    // Function to fetch meals by first letter
    function fetchMealsByFirstLetter(letter) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    displaySearchResults(data.meals);
                } else {
                    // Display an alert if the category is not available
                    alert(`Sorry, there are no meals starting with "${letter.toUpperCase()}". Please try another letter.`);
                }
            })
            .catch(error => console.log('Error fetching meals by first letter:', error));
    }

    // Function to fetch search results by meal name
    function fetchSearchResultsByName(name) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    displaySearchResults(data.meals);
                } else {
                    // Display an alert if the category is not available
                    alert(`Sorry, "${name}" is not available in the provided categories. Please try another choice or category.`);
                }
            })
            .catch(error => console.log('Error fetching search results:', error));
    }

    // Function to display search results
    function displaySearchResults(meals) {
        // Add new items to stack
        recentItems.unshift(...meals);

        // Update displayed items in bottom section
        updateDisplayedItems();
    }

    // Function to update displayed items in bottom section
    function updateDisplayedItems() {
        // Clear previous results
        recentlySearchedContainer.innerHTML = '';


        const displayedItems = recentItems
        displayedItems.forEach(meal => {
            const mealElement = document.createElement('div');
            mealElement.classList.add('searched-meal');
            mealElement.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p>${meal.strMeal}</p>
            `;
            recentlySearchedContainer.appendChild(mealElement);

            // Add click event listener to each item
            mealElement.addEventListener('click', () => {
                displayModalContent(meal);
            });
        });
    }

// Function to display the category label
function displayCategoryLabel(category) {
    // Remove "Searched" from the category text
    const categoryText = category.replace('Searched: ', '');
    // Set the category label text without "Searched"
    categoryLabel.textContent = categoryText;
}
});