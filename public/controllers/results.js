app.controller('results', function($scope, $resource, $routeParams, $location) {
  var api = $resource('/api/search/:word');

  var results = api.query({'word': $routeParams.word}, function() {
    console.log('API RESULTS: ', results);
    
    var seObj = {}, searchSuggestions = [];

    for(key in results) {
      if(!seObj[results[key].searchFor]) {
        seObj[results[key].searchFor] = true;
        searchSuggestions.push(results[key].searchFor);
      }
    }

    $scope.$parent.$broadcast('searchSuggestions:update', searchSuggestions);

    $scope.results = results;
    $scope.showNewEntryForm = results.length === 0;
    $scope.numResults = results.length;
    if(!$scope.numResults) {
      $location.path('/add/'+$routeParams.word);
    }



  });
});