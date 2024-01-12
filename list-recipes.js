
// once document is loaded, load list of markdown files
// and generate table of contents, plus a quick-nav list
// at the top
$(document).ready(function () {
    let listOfRecipes = '';
    let listOfLetters = '';
    let prevLetter = '';
    const map1 = new Map();

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
            let ingredientsList = arraySplit[2];
            let ingredients = ingredientsList.split("*");
            // Faut pas créer uin nouveau tableau ?
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

    setTimeout(() => {
        let test = "";
        map1.forEach((values, keys) => {
            //test += '<a href="recipe.php#' + keys + '">' + keys + '</a></li>';

        })
        //$('#navigation').html(test);
    }, (1000));

    $("#recipeSearch").on("keyup", function() {
        let searchValue = $(this).val().toLowerCase().trim();

        // Hidding all of the element
        map1.forEach((values, keys) => {
            let currentElement = document.getElementById(values);
                if(currentElement) {
                    currentElement.parentElement.style.display = "none";
            }
        })

        // Displaying only the recipies found
        // Would be better to add a CSS class to it, and not search twice into the dictionnary
        let foundRecipe = map1.get(searchValue);
        if(foundRecipe) {
            for(let i = 0; i < foundRecipe.length; i++) {
                    let foundElement = document.getElementById(foundRecipe[i]);
                    if(foundElement)
                        foundElement.parentElement.style.display = "block"
                }
            }
      });

    // add recipes to page...
    $('#toc ul').html(listOfRecipes);

    // ...and the list of first-letters for quick nav
    $('#navigation').html(listOfLetters);

    function ParseIngredients(recipe, ingredient) {
        // Getting all recipe with parenthesis
        ingredientParsed = ingredient.match(/\[(.*?)\]/g);

            if(ingredientParsed) {
                ingredientParsed = ingredientParsed.toString();
                ingredientParsed = ingredientParsed.replace("[", '');
                ingredientParsed = ingredientParsed.replace("]", '');
                ingredientParsed = ingredientParsed.toLowerCase(); 

                let recipeList = [];

                recipeList = map1.get(ingredientParsed);

                if(!recipeList) {
                    recipeList = [];
                }
                
                recipeList.push(recipe);
            
            map1.set(ingredientParsed, recipeList);
            }
    }
});


