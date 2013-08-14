app.controller('add', function($scope, $routeParams, $resource, $location, $log) {
  console.log('add new items');
  var api = $resource('/api/search/:word');


  $scope.searchFor = $routeParams.word;

  $scope.submitEntry = function submitEntry() {
    $log.info('Add:', $scope.searchFor, '=>', $scope.newEntry, $scope.newSample);
    
    var newResult = new api();
    newResult.searchFor = $scope.searchFor;
    newResult.result = $scope.newEntry;
    newResult.example = $scope.newSample;
    newResult.$save();

    $location.path('/search/'+$scope.searchFor);
  };
});