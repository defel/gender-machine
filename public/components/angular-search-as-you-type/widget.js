
window.searchAsYouTypeWidget = function(app, options) {

  var
    searchAsYouType,
    defaults = {},
    options = angular.extend({}, defaults, options);

  var SearchAsYouType = function searchAsYouType() {

  };


  SearchAsYouType.prototype = {
    data: {},
    elements: {},
    state: {},
    shared: {},

    events: {},

    initEvents: function() {
      var 
        plugin = this,
        timeout; 

      var onTypeDebounced = (function () {
        var sendCallback = function() {
          console.log('EVENT CALLED DEBOUNCED?');
          console.log(plugin.element);
          plugin.scope.callback(plugin.element[0].value);
          plugin.scope.$apply();
        };

        window.clearTimeout(timeout);
        timeout = window.setTimeout(sendCallback, 250);
      });

      plugin.element.bind('keyup', onTypeDebounced); 
    },

  };

  var factoryFn = function() {
    
    return {
      restrict: 'A',
      scope: {
        callback: '=searchAsYouType'
      },
      require: '?ngModel',

      link: function(scope, element, attrs, ctrl) {
        console.log('SEARCH AS YOU TYPE INITIALIZED!!', scope);
        var plugin = new SearchAsYouType(app, options);

        plugin.modelCtrl = ctrl;
        plugin.element = element; 
        plugin.scope = scope;

        plugin.initEvents(); 
      }
    };
  };

  app.directive('searchAsYouType', factoryFn);
};
