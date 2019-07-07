app.controller('currencyController', ['$scope', 'currencyService', 'stateService',
    function ($scope, currencyService, stateService) {
        var vm = this;

        vm.data = {};
        vm.default = {
            currencies: [],
            lastUpdated: null,
            filter: "",
            timespan: "percent_change_1h"
        }

        // function to determine which class to show based on whether a currencies movement has gone up, down or stayed the same
        vm.getDirection = (movement) => {
            if (movement > 0) {
                return 'up'
            } else if (movement < 0) {
                return 'down'
            } else {
                return 'right';
            }
        }

        // preserve our state when this controller is destroyed
        $scope.$on("$destroy", () => {
            stateService.saveState("currencyControllerData", vm.data);
        });

        // if currencies have been updated refresh the data
        $scope.$on('CURRENCY_UPDATED', () => {
            console.log("Got message, currency updated");
            vm.currencies = currencyService.getCurrencyDetails();
        });

        // Get any saved state and merge with our default
        angular.merge(vm.data, vm.default, stateService.loadState("currencyControllerData"));
        vm.currencies = currencyService.getCurrencyDetails();

        return vm;
    }
]);
