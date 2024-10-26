
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
            SearchInputFromURL();
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

    BindSearchToKey();

    // add recipes to page...
    $('#toc ul').html(listOfRecipes);

    // ...and the list of first-letters for quick nav
    $('#navigation').html(listOfLetters);

    function BindSearchToKey() {
        $("#recipeSearch").on("keyup", function() {
            let searchValue = $(this).val().toLowerCase().trim();
            SearchInput(searchValue);
        });
    }

    function SearchInput(input) {
        // Removing the class from the already existing element.
        $('.recipeFound').each((index, element) => {
            element.classList.remove('recipeFound');
        });

        
        if(input.length == 0) {
            return;
        }

        // Displaying only the recipies found
        ingredientsToRecipe.forEach((value, key, map) => {
            if(key.includes(input)) {
                for(let i = 0; i < value.length; i++) {
                    let foundElement = document.getElementById(value[i]);
                    if(foundElement) {
                        foundElement.classList.add("recipeFound");
                    }
                }
            
            }
        });
    }

    function SearchInputFromURL() { 
        let url = new URL(window.location);

       let params = new URLSearchParams(url.search.slice(1));

       if(params.get('ingredients') !== null) {
           let foundIngredient = params.get('ingredients');
           SearchInput(foundIngredient);
            // TODO auto fill input field from val here
          //$("#recipeSearch").val(foundIngredient);
       }
    }


    function ParseIngredients(recipe, ingredient) {
        let ingredientParsed = ingredient.toString();
        ingredientParsed = ingredientParsed.toLowerCase(); 
        
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


