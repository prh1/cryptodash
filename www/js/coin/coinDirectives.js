// simple directive to display a currency coins value
app.directive('coinWidget', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/coinwidget.html',
        replace: true,
        scope: {
            coin: '=',
            timespan: '=',
            direction: '='
        }
    }
});