"use strict";

var express = require('express');
var router = express.Router();

var log4js = require('log4js'); 
var logger = log4js.getLogger("routes.api");
logger.level = 'trace';

var CoinHelper = require("../modules/coinmarketcap.js");
var coinHelper = new CoinHelper(logger);

var DataStore = require("../modules/datastore.js");
var dataStore = new DataStore(logger);

// Holding logic

router.post("/holding/create", (req, res) => {
    var portfolioId, amount, coin;

    // Validate the data passed to us
    if (req.body.id != undefined) {
        portfolioId = ~~req.body.id;
    } else {
        logger.info("POST holding called with no id");
        res.status(400).end(JSON.stringify({ error: "You must supply a portfolio id" }));
        return;
    }

    if (req.body.amount != undefined) {
        amount = parseFloat(req.body.amount);
        if ((isNaN(amount)) || (amount < 0)) {
            logger.info("POST holding called with invalid amount");
            res.status(400).end(JSON.stringify({ error: "You must supply a valid amount" }));
            return;
        }
    } else {
        logger.info("POST holding called with no amount");
        res.status(400).end(JSON.stringify({ error: "You must supply a valid amount" }));
        return;
    }

    if (req.body.coin != undefined) {
        coin = req.body.coin;
    } else {
        logger.info("POST holding called with no coin id");
        res.status(400).end(JSON.stringify({ error: "You must supply a coin id" }));
        return;
    }

    logger.trace("Adding holding to portfolio");
    dataStore.holding.create(portfolioId, coin, amount)
        .then((data) => {
            res.end(JSON.stringify(data));
        }).catch((e) => {
            logger.error(e);
            res.status(500).end(e);
        });
});

// Delete a holding from a portfolio
router.delete("/holding/:holdingId", (req, res) => {
    var holdingId = req.params.holdingId;
    logger.trace("Deleting item from portfolio");
    dataStore.holding.delete(holdingId)
        .then((data) => {
            res.end(JSON.stringify(data));
        }).catch((e) => {
            logger.error(e);
            res.status(500).end(e);
        });
});

// Add a new holding
router.post("/holding/:holdingId", (req, res) => {
    var amount;
    var holdingId = req.params.holdingId;
    if (req.body.amount != undefined) {
        amount = parseFloat(req.body.amount);
        if ((isNaN(amount)) || (amount < 0)) {
            logger.info("/holding/{holdingId} called with invalid amount");
            res.status(400).end(JSON.stringify({ error: "You must supply a valid amount" }));
            return;
        }
    } else {
        logger.info("/holding/{holdingId} called with no amount");
        res.status(400).end(JSON.stringify({ error: "You must supply an amount" }));
        return;
    }

    logger.trace("Updating holding amount");
    dataStore.holding.update(holdingId, amount)
        .then((data) => {
            res.end(JSON.stringify(data));
        }).catch((e) => {
            logger.error(e);
            res.status(500).end(e);
        });

});

// Get details of the holdings within a portfolio
router.get("/portfolio/:portfolioId", (req, res) => {
    var portfolioId = req.params.portfolioId;
    logger.trace("Getting details for portfolio", portfolioId);
    dataStore.portfolio.read(portfolioId)
        .then((holdingDetails) => {
            res.end(JSON.stringify(holdingDetails));
        }).catch((e) => {
            logger.error(e);
            res.status(500).end(e);
        });
});

// Get a list of all portfolios
router.get("/portfolio", (req, res) => {
    logger.trace("Getting list of portfolios");
    dataStore.portfolio.list()
        .then((portfolios) => {
            res.end(JSON.stringify(portfolios));
        }).catch((e) => {
            logger.error(e);
            res.status(500).end(e);
        });
});

// Create a new portfolio
router.post("/portfolio/create", (req, res) => {
    var name;

    if (req.body.name != undefined) {
        name = req.body.name;
    } else {
        logger.info("Create portfolio called with no name parameter");
        res.status(400).end(JSON.stringify({ error: "You must supply a name parameter" }));
        return;
    }

    if (name.length < 1 || name.length > 50) {
        logger.info("Create portfolio called with invalid name");
        res.status(400).end(JSON.stringify({ error: "You must supply a valid name parameter" }));
        return;
    }

    dataStore.portfolio.create(name)
        .then((portfolioId) => {
            res.end(JSON.stringify(portfolioId));
        }).catch((e) => {
            logger.error(e);
            res.status(500).end(e);
        });
});

// Cyptocurrency values api
router.get("/currencies", (req, res) => {
    logger.trace("Getting currency details");
    coinHelper.getCurrencyDetails()
        .then((currencies) => {
            logger.trace("Got currency details");
            res.end(JSON.stringify(currencies));
        }).catch((e) => {
            logger.error(e);
            res.status(500).end(e);
        });
});



module.exports = router;