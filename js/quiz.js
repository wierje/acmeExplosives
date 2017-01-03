jQuery(document).ready(function($) {
    // The DOM is ready!
    // The rest of your code goes here!
    console.log('ready');

    var dropDown = $('.category-selector');
    var output = $('.output');
    var categories, types, products;

    var getCategories = function() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'assets/categories.json'
            }).done(function(result) {
                console.log(result);
                resolve(result.categories);
            }).fail(function(error) {
                reject(error);
            });
        });
    };
    // getCategories();

    var getTypes = function() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'assets/types.json'
            }).done(function(result) {
                resolve(result.types);
            }).fail(function(error) {
                reject(error);
            });
        });
    };

    // getTypes();

    var getProducts = function() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'assets/products.json'
            }).done(function(result) {
                resolve(result.products);
            }).fail(function(error) {
                reject(error);
            });
        });
    };

    // getProducts();

    var getInventory = function(id) {
        console.log(id);
        getCategories()
            .then(function(returnedCategories) {
                categories = returnedCategories;
                return getTypes();
            })
            .then(function(returnedTypes) {
                types = returnedTypes;
                return getProducts();
            })
            .then(function(returnedProducts) {
                products = returnedProducts;
            })
            .then(function() {
                filterCategories(id);
                // console.log('categories ', categories);
                // console.log('types ', types);
                // console.log('products ', products);
            });
    };

    var populateDropdown = function(dropDownCategories) {
        for (var key in dropDownCategories) {
            var option = `<option class='options' id="${dropDownCategories[key].id}">${dropDownCategories[key].name} </option>`
            dropDown.append(option);
        }
    };

    getCategories()
        .then(function(dropDownCategories) {
            populateDropdown(dropDownCategories);
            loadEventListeners();
        });

    var loadEventListeners = function() {
        dropDown.change(function(event) {
            getInventory(Number($(this).children(':selected')[0].id));
        });
    };

    var filterCategories = function(id) {
        for (var key in categories) {
            console.log(categories[key].id);
            console.log(categories[key]);
            if (categories[key].id === id) {
                filterTypes(id, categories[key].name);
            }
        }
    };

    var filterTypes = function(id, name) {
        var typesArray = [];
        for (var key in types) {
            if (types[key].category === id) {
                var currentTypeObject = {
                    categoryName: name,
                    typeName: types[key].name,
                    typeDescription: types[key].description,
                    productType: types[key].id
                };
                typesArray.push(currentTypeObject);
            }
        }
        filterProducts(typesArray);
    };

    var filterProducts = function(typesArray) {
        var productsArray = [];
        for (var type in typesArray) {
            for (var key in products) {
                for (var obj in products[key]) {
                    if (typesArray[type].productType === products[key][obj].type) {
                        var currentProductObject = {
                            categoryName: typesArray[type].categoryName,
                            typeName: typesArray[type].typeName,
                            typeDescription: typesArray[type].typeDescription,
                            productName: products[key][obj].name,
                            productDescription: products[key][obj].description

                        };
                        productsArray.push(currentProductObject);
                    }
                }
            }
            populateDom(productsArray);
        }
    };  var populateDom = function(productsArray) {
      output.html("");
      for (var product in productsArray) {
        output.append(
        `<tr>
        <td>${productsArray[product].categoryName}</td>
        <td>${productsArray[product].typeName}</td>
        <td>${productsArray[product].productName}</td>
        <td>${productsArray[product].productDescription}</td>
        </tr>`
        );
      }
    };




}(jQuery)); //end
