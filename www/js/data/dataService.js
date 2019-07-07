app.service('dataService', ['$http', '$q',
    function ($http, $q) {

        // functions to call the api to manipulate portfolios
        this.portfolio = {};

        this.portfolio.create = (name) => {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'api/portfolio/create',
                data: { name: name }
            }).then(function (res) {
                console.log("Created new portfolio");
                deferred.resolve(res.data);
            }).catch(function (err) {
                console.log("Error ", err);
                deferred.reject(err);
                });
            return deferred.promise;
        }

        this.portfolio.list = function () {
             var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'api/portfolio'
            }).then(function (res) {
                    console.log("Got portfolio list");
                    deferred.resolve(res.data);
                }).catch(function (err) {
                    console.log("Error ", err);
                    deferred.reject(err);
                });

            return deferred.promise;
        };
        this.portfolio.read = (portfolioId) => {
            console.log("Getting holding detail for portfolio", portfolioId);
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'api/portfolio/' + portfolioId,
            }).then(function (res) {
                console.log("Got holding details for portfolio");
                deferred.resolve(res.data);
            }).catch(function (err) {
                console.log("Error ", err);
                deferred.reject(err);
            });
            return deferred.promise;
        };

        // functions to call the api to manipulate holdings
        this.holding = {};

        this.holding.create = (id, coin, amount) => {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'api/holding/create',
                data: { id: id, coin: coin, amount: amount }
            }).then(function (res) {
                console.log("Added holding to portfolio");
                deferred.resolve(res.data);
            }).catch(function (err) {
                console.log("Error ", err);
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.holding.update = (id, amount) => {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'api/holding/' + id,
                data: { amount: amount}
            }).then(function (res) {
                console.log("Updated holding amount");
                deferred.resolve(res.data);
            }).catch(function (err) {
                console.log("Error ", err);
                deferred.reject(err);
                });
            return deferred.promise;
        };

        this.holding.delete = (id) => {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: 'api/holding/' + id,
            }).then(function (res) {
                console.log("Deleting holding");
                deferred.resolve(res.data);
            }).catch(function (err) {
                console.log("Error ", err);
                deferred.reject(err);
                });
            return deferred.promise;
        }

    }
]);
    