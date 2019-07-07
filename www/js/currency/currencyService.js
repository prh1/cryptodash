app.service('currencyService', ['$http', '$q', '$rootScope',
    function ($http, $q, $rootScope) {

        // This service is used get the current currency amounts from the backend.
        // The service will call the api at a specified interval and broadcast a message 'CURRENCY_UPDATED'
        // each time if has got new values.  This is used in implementing the auto-refresh functionality.

        var currencies = {}; // move to currency service? yes
        var refreshRate = "60000"; // how often are we going to refresh the data?
        var timeoutId; // what's the id of the last timeout we created

        var self = this;

        // call the api to get the lastest values for the currency details
        this.refreshCurrencyDetails = () => {
            console.log("Updating currency details");
            $http({
                method: 'GET',
                url: 'api/currencies'
            }).then(function (res) {
                console.log("Got currency details");
                currencies = res.data;
                $rootScope.$broadcast("CURRENCY_UPDATED");
                if (refreshRate > 0) {
                    timeoutId = setTimeout(self.refreshCurrencyDetails, refreshRate);
                } else {
                    timeoutId = undefined;
                }
            }).catch(function (err) {
                console.log("Error ", err);
            });
        };

        this.getCurrencyDetails = () => {
            return currencies;
        };

        this.getRefreshRate = () => {
            return refreshRate;
        }

        // Change the refresh rate
        this.changeRefreshRate = (newRefreshRate) => {
            clearTimeout(timeoutId);
            refreshRate = newRefreshRate;
            self.refreshCurrencyDetails();
        };
    }
]);
    