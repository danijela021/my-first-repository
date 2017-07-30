// Define a new module for our app
var app = angular.module("SearchByRegion", []);

// Create the instant search filter

app.filter('searchFor', function(){

  /* All filters must return a function. The first parameter
   is the data that is to be filtered, and the second is an
   argument that may be passed with a colon (searchFor:searchString)*/

  return function(arr, searchString){

    if(!searchString){
      return arr;
    }

    var result = [];

    searchString = searchString.toLowerCase();

    // Using the forEach helper method to loop through the array
    angular.forEach(arr, function(home){

      if(home.region.toLowerCase().indexOf(searchString) !== -1){
        result.push(home);
      }

    });

    return result;
  };

});

function HomeController($scope){

  /* Define the model properties. The view will loop
   through the services array and genreate a li
   element for every one of its items.*/

  $scope.homes = [
    {
      name: 'Loft Apartment',
      rooms: 4,
      rent: 3000,
      price: 200000,
      m2: 75,
      region: 'A',
      address:'street5',
      image: 'images/1.jpg'
    },{
      name: 'Lovely House',
      rooms: 4,
      rent: 3500,
      price: 250000,
      m2: 130,
      region: 'C',
      address:'street6',
      image: 'images/2.jpg'
    },{
      name: 'Beachside Condo',
      rooms: 3,
      rent: 2300,
      price: 180000,
      m2: 80,
      region: 'A',
      address:'street1',
      image: 'images/3.jpg'
    },{
      name: 'Center town Studio',
      rooms: 5,
      rent: 2800,
      price: 195000,
      m2: 95,
      region: 'B',
      address:'street2',
      image: 'images/4.jpg'
    },{
      name: 'Artist Studio',
      rooms: 6,
      rent:3500,
      price: 270000,
      m2: 150,
      region: 'B',
      address:'street3',
      image: 'images/5.jpg'
    },{
      name: 'Downtown Apartment',
      rooms: 2,
      rent: 1500,
      price: 120000,
      m2: 60,
      region: 'A',
      address:'street4',
      image: 'images/6.jpg'
    }
  ];

  }
