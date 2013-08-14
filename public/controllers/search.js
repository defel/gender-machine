app.controller('search', function($scope, $log, $resource, $location) {

  $scope.searchSuggestions = [];
  $scope.dropDownStyle = {};
  $scope.valuesEntered = false;

  $scope.searchForWord = function(word) {
    $location.path('/search/'+encodeURIComponent(word));
    $scope.searchFor = word;
  }

  $scope.searchFn = function searchFn() {
    $scope.searchForWord($scope.searchFor);
  };

  $scope.searchCb = function searchCb(val) {
    $scope.valuesEntered = true;
    if(val && val.length > 2) {
      $scope.searchForWord(val);  
    } else {
      $location.path('/');
    }
  }

  $scope.$on('searchSuggestions:update', function(ev, data) {
    $scope.searchSuggestions = data;
    
    if($scope.valuesEntered && data && data.length > 1 && $location.path() !== '/') {
      $scope.dropDownStyle = {
        'display': 'block',
        'border-radius': '0px',
        'margin-left': '90px',
        'width': '296px'
      };
    }

    console.log('UPDATE: ', data, $scope.$id);
  });

  $scope.$on('event:click:doc', function() {
    console.log('CLICK EVENT!', $scope.dropDownStyle);
    $scope.valuesEntered = false;
    $scope.dropDownStyle = {};
    $scope.$apply();
  });

  $scope.submitEntry = function submitEntry() {
    $log.info('Add:', $scope.searchFor, '=>', $scope.newEntry, $scope.newSample);
    
    var newResult = new api();
    newResult.searchFor = $scope.searchFor;
    newResult.result = $scope.newEntry;
    newResult.example = $scope.newSample;
    newResult.$save();
  };
});
