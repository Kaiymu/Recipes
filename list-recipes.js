
// once document is loaded, load list of markdown files
// and generate table of contents, plus a quick-nav list
// at the top
$(document).ready(function () {
    let listOfRecipes = '';
    let listOfLetters = '';
    let prevLetter = '';
    const ingredientsToRecipe = new Map();

    // create list of recipes
    for (let i in files) {
        let url = files[i];
        // skip files that start with underscore
        // (such as the _template.md file)
        if (url[0] === '_') {
            continue;
        }

        // create anchor and name from url
        let anchor = url.replace('.md', '');
        let name = anchor.split('-').join(' ');

        fetch("recipes/" + url)
        .then((res) => res.text())
        .then((text) => {
            let arraySplit = text.split("##");
            let ingredientsList = "";
            let tagList = String.empt;

            arraySplit.forEach((word) => {
                if(word.includes("ingredients")) {
                    ingredientsList = word;
                }

                if(word.includes("tags")) {
                    tagList =  word
                }
            });

            let mergedArray = ingredientsList.concat(tagList);
            let ingredients = extractWords(mergedArray)

            ingredients.forEach((ingredient) => ParseIngredients(name, ingredient));
        })
        .catch((e) => console.error(e));

        // if the first letter of the recipe hasn't been
        // seen yet, add to list of letters and put an achor in
        let firstLetter = name.charAt(0).toUpperCase();
        if (firstLetter !== prevLetter) {
            listOfRecipes += '<li id="' + firstLetter + '">';
            listOfLetters += '<a href="#' + firstLetter + '">' + firstLetter + ' </a>';
        }
        else {
            listOfRecipes += '<li>';
        }

        listOfRecipes += '<a id="' + name + '" href="recipe.php#' + anchor + '">' + name + '</a></li>';
        prevLetter = firstLetter;
    }    

    searchInput();

    // add recipes to page...
    $('#toc ul').html(listOfRecipes);

    // ...and the list of first-letters for quick nav
    $('#navigation').html(listOfLetters);

    function searchInput() {
        $("#recipeSearch").on("keyup", function() {
            let searchValue = $(this).val().toLowerCase().trim();
    
            // Removing the class from the already existing element.
            $('.recipeFound').each((index, element) => {
                element.classList.remove('recipeFound');
            });
    
            // Displaying only the recipies found
            let foundRecipe = ingredientsToRecipe.get(searchValue);
            if(foundRecipe) {
                for(let i = 0; i < foundRecipe.length; i++) {
                        let foundElement = document.getElementById(foundRecipe[i]);
                        if(foundElement) {
                            foundElement.classList.add("recipeFound");
                        }
                    }
                }
          });
    }

    function ParseIngredients(recipe, ingredient) {
        let ingredientParsed = ingredient.toString();
        ingredientParsed = ingredientParsed.toLowerCase(); 
    
        // Checking if the word is un plural and removing it
        if(ingredientParsed.slice(-1) == "s") {
            ingredientParsed = ingredientParsed.slice(0, -1);
        } 

        let recipeList = [];

        recipeList = ingredientsToRecipe.get(ingredientParsed);

        // If the array is null, create it.
        if(!recipeList) {
            recipeList = [];
        }
        
        recipeList.push(recipe);
    
        ingredientsToRecipe.set(ingredientParsed, recipeList);
    }
});


