app.controller('dashboardController', ['$scope', '$location', 'currencyService',
    function ($scope, $location, currencyService) {
        var vm = this;

        vm.data = {
            refreshRate: currencyService.getRefreshRate()
        };

        // manual refresh of currencies from the api
        vm.refreshCurrencies = () => {
            currencyService.refreshCurrencyDetails();
        };

        // return true if the location passed matches the current path, used for hilighting the side-menu options
        vm.isActive = (location) => {
            return location === $location.path();
        };

        // If we recieve a CURRENCY_UPDATED event we want to keep track of the time this happened
        $scope.$on('CURRENCY_UPDATED', () => {
            console.log("Got message, currency updated");
            vm.data.lastUpdated = new Date();
        });

        // If the refresh rate is changed by the user we need to tell our service this
        $scope.$watch('vm.data.refreshRate', function () {     
            console.log("Refresh rate has changed");
            currencyService.changeRefreshRate(vm.data.refreshRate);
        });

        return vm;
    }
]);
