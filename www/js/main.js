"use strict";

var app = angular.module('coinDashboard', ['toastr', 'ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            redirectTo: "/currencies",
        })
        .when("/currencies", {
            templateUrl: "views/currencies.html",
            controller: "currencyController as vm"
        })
        .when("/managePortfolio", {
            templateUrl: "views/portfolio.html",
            controller: "portfolioController as vm"
        })
        .when("/notes", {
            templateUrl: "views/notes.html"
        })
        .otherwise({
            redirectTo: "/currencies"
        });
});