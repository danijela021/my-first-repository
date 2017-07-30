// Define a new module for our app
var app = angular.module("SearchByName", []);

// Create the instant search filter

app.filter('searchFor', function(){

  // All filters must return a function. The first parameter
  // is the data that is to be filtered, and the second is an
  // argument that may be passed with a colon (searchFor:searchString)

  return function(arr, searchString){

    if(!searchString){
      return arr;
    }

    var result = [];

    searchString = searchString.toLowerCase();

    // Using the forEach helper method to loop through the array
    angular.forEach(arr, function(wine){

      if(wine.name.toLowerCase().indexOf(searchString) !== -1){
        result.push(wine);
      }

    });

    return result;
  };

});

function WineController($scope){

  // Define the model properties. The view will loop
  // through the services array and genreate a li
  // element for every one of its items.

  $scope.wines = [
    {
      name: 'Red',
      country: 'France',
      price: 500,
      year: 1999,
      grapes: 'Red',
      region: 'A',
      active:false
    },{
      name: 'White',
      country: 'France',
      price: 300,
      year: 1999,
      grapes: 'White',
      region: 'C',
      active:false
    },{
      name: 'Rose',
      country: 'France',
      price: 220,
      year: 2007,
      grapes: 'Red',
      region: 'A',
      active:false
    },{
      name: 'Red',
      country: 'Serbia',
      price: 400,
      year: 2007,
      grapes: 'Red',
      region: 'B',
      active:false
    },{
      name: 'White',
      country: 'Serbia',
      price:200,
      year: 2010,
      grapes: 'White',
      region: 'B',
      active:false
    },{
      name: 'Rose',
      country: 'Serbia',
      price: 120,
      year: 2009,
      grapes: 'Rose',
      region: 'A',
      active:false
    },{
      name: 'Red',
      country: 'Italia',
      price: 520,
      year: 1999,
      grapes: 'Red',
      region: 'C',
      active:false
    },{
      name: 'White',
      country: 'Italia',
      year: 1993,
      price: 250,
      grapes: 'White',
      region: 'A',
      active:false
    },{
      name: 'Rose',
      country: 'Italia',
      year: 1997,
      price: 250,
      grapes: 'Red',
      region: 'C',
      active:false
    }
  ];

  $scope.toggleActive = function(s){
    s.active = !s.active;
  };

  // Helper method for calculating the total price

  $scope.total = function(){

  var total = 0;

    // Use the angular forEach helper method to
    // loop through the services array:

    angular.forEach($scope.wines, function(s){
      if (s.active){
        total+= s.price;
      }
    });

    return total;
  };
}
