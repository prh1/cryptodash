app.controller('portfolioController', ['$scope', 'toastr', '$uibModal', 'dataService', 'stateService', 'currencyService',
    function ($scope, toastr, $uibModal, dataService, stateService, currencyService) {
        var vm = this;
        console.log("Initialising portfolio controller");

        vm.data = {};

        // add a holding to a portfolio
        vm.addHolding = () => {
            if(vm.adding.symbol === "") {
                toastr.error("You must select a currency type to add to your portfolio");
                return;
            }
            dataService.holding.create(vm.data.currentPortfolio, vm.adding.symbol, vm.adding.amount).then(() => {
                getPortfolioDetails();
                vm.modalInstance.close();
                toastr.success("Currency added to your portfolio");
            }).catch((e) => {
                console.log("error", e);
                toastr.error("Unexpected error", "Error when adding coin to portfolio");
            });

        }

        // update the amount of a particular holding
        vm.updateHolding = () => {
            dataService.holding.update(vm.data.holdings[vm.updating.index].holding_id, vm.updating.amount)
                .then(() => {
                    vm.data.holdings[vm.updating.index].amount = vm.updating.amount + "";
                    calculateTotals(); // our holding amount has changed so we need to recalculate the grand total of our portfolio
                    vm.modalInstance.close();
                }).catch((e) => {
                    console.log("error", e);
                    toastr["error"]("Unexpected error", "Unable to update holding amount");
                });
        }

        // delete a holding
        vm.deleteHolding = () => {
            dataService.holding.delete(vm.data.holdings[vm.deleting.index].holding_id)
                .then(() => {
                    getPortfolioDetails(); // refresh our portfolio from the database
                    vm.modalInstance.close();
                    toastr.success("Holding removed from your portfolio");
                }).catch((e) => {
                    console.log("error", e);
                    toastr["error"]("Unexpected error", "Unable to remove currency from your portfolio");
                });
        };

        // add a new portfolio
        vm.addPortfolio = () => {
            console.log("Creating a new portfolio");
            if ((vm.newPortfolioName || "") === "") {
                toastr.error("You must provide a name for your portfolio");
                return;
            }
            dataService.portfolio.create(vm.newPortfolioName)
                .then((data) => {
                    console.log("Created portfolio with id", data);
                    vm.data.currentPortfolio = data;

                    getPortfolioDetails(); // update the portfolio

                    // refresh our list of portfolios
                    dataService.portfolio.list() 
                        .then((data) => {
                            vm.data.portfolios = data;
                        });
                    vm.modalInstance.close();
                    toastr.success("Portfolio successfully created");
                }).catch((e) => {
                    console.log("error", e);
                    toastr.error("Unexpected error", "Error getting portfolio details");
                });
        }

        function getCurrenciesNotHeld() {
            // Taking the list of all available currencies and remove any that the are
            // already in this portfolio, so that we have a list of all currencies that
            // are not currently held.  

            var unheldCurrencies = [];
            for (var key in vm.currencies) {
                var matched = false;
                for (var j = 0; j < vm.data.holdings.length; j++) {
                    if (vm.data.holdings[j].coin === key) {
                        matched = true;   
                        break;
                    }
                }
                if (!matched) {
                    unheldCurrencies.push(vm.currencies[key]);
                }
            }
            return unheldCurrencies;
        }


        // show one of the dialogs for this page, initialising data for the appropriate one
        vm.showDialog = (dialog, index) => {
            switch(dialog) {
                case "addPortfolio": {
                    vm.newPortfolioName = "";
                    break;
                }
                case "addHolding": {
                    vm.adding = {
                        amount: 0,
                        symbol: "",
                        availableCurrencies: getCurrenciesNotHeld()
                    };
                    break;
                }
                case "updateHolding": {
                    vm.updating = {
                        index: index,
                        amount: parseFloat(vm.data.holdings[index].amount),
                        symbol: vm.updatingSymbol = vm.currencies[vm.data.holdings[index].coin].symbol
                    };
                    break;
                }
                case "deleteHolding": {
                    vm.deleting = {
                        name: vm.currencies[vm.data.holdings[index].coin].name,
                        index: index
                    };
                    break;                            
                }
            };

            vm.modalInstance = $uibModal.open({
                  templateUrl: 'views/dialogs/' + dialog + '.html',
                  scope: $scope
            });
        }

        // cancel the active dialog
        vm.dialogCancel = () => {
            vm.modalInstance.close();
        }


        // calculate the total value of the current holdings
        calculateTotals = () => {
            var newTotal = 0;
            if (vm.data.holdings != undefined) {
                for (var i = 0; i < vm.data.holdings.length; i++) {
                    if (vm.currencies[vm.data.holdings[i].coin] != undefined) {
                        newTotal = newTotal + (vm.data.holdings[i].amount * vm.currencies[vm.data.holdings[i].coin].price) 
                    }
                }
                vm.data.grandTotal = newTotal;
            }
        }

        // read the detials of the current portfolio and calulate the totals
        getPortfolioDetails = () => {
            if (vm.data.currentPortfolio != undefined) {
                dataService.portfolio.read(vm.data.currentPortfolio)
                    .then((data) => {
                        console.log("Got portfolio details", data);
                        vm.data.holdings = data;
                        calculateTotals();
                    }).catch((e) => {
                        console.log("error", e);
                        toastr["error"]("Unexpected error", "Error getting portfolio details");
                    });
            }
        }


        // get the list of portfolios and current currency values
        initialiseData = () => {
            vm.currencies = currencyService.getCurrencyDetails();
            dataService.portfolio.list()
                .then((data) => {
                    console.log("Got", data);
                    vm.data.portfolios = data;
                    if (data.length > 0) {
                        vm.data.currentPortfolio = stateService.loadState("currentPortfolio") || data[0].portfolio_id + "";
                        
                        console.log("Current portfolio is", vm.data.currentPortfolio);
                    }
                }).catch((e) => {
                    console.log("error", e);
                    toastr["error"]("Unexpected error", "Error getting portfolio list information");
                }).finally(() => {
                    vm.data.message = "";
                });
        }

        // if the current portfolio changes we want to get the details of the holdings from the data store
        $scope.$watch('vm.data.currentPortfolio', function () {
            getPortfolioDetails();
        });

        // if the currency values have changed we update our data and recalculate the portfolio total
        $scope.$on('CURRENCY_UPDATED', () => {
            console.log("Got message, currency updated");
            vm.currencies = currencyService.getCurrencyDetails();
            calculateTotals();
        });

         $scope.$on("$destroy", () => {
            stateService.saveState("currentPortfolio", vm.data.currentPortfolio);
        });

        initialiseData();

        return vm;

    }
]);
   