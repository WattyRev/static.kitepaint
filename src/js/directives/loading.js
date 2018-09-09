app.directive("loading", function() {
    function link(scope, element, attrs) {}
    return {
        restrict: "E",
        templateUrl: app.staticDomain + "html/directives/loading.html",
        link: link
    };
});
