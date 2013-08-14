window.captureEventsDirective = function(app, options) {
  
  console.log('WTF!');

  app.directive('captureEvents', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var elemName = attrs.captureEvents;

        element.bind('click', function() {
          scope.$broadcast('event:click:'+elemName);
        });
        
      }
    }
  });
};