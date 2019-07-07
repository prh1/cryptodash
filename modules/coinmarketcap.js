"use strict";

// Helper functions to interface with coinmaketcap

var request = require('request');

function api(logger) {

    // transform api data to a hash map which we can use a little more easily client side, only including
    // properties we are really interested in
    var extractCoinNamesAndSymbols = (data) => {
        return data.reduce((map, c) => {
            map[c.id] = {
                name: c.name, symbol: c.symbol, price: c.price_usd,
                id: c.id,
                percent_change_1h: c.percent_change_1h || 0,
                percent_change_24h: c.percent_change_24h || 0,
                percent_change_7d: c.percent_change_7d || 0
            }
            return map
        }, {});
    }

    this.getCurrencyDetails = () => {
        logger.info("Getting currency details");
        return new Promise((resolve, reject) => {
            request.get('https://api.coinmarketcap.com/v1/ticker/?limit=0', (err, res) => {
                if (res.statusCode === 200) {
                    var data = JSON.parse(res.body);
                    logger.info("Got ", data.length, "records");
                    var currencyMap = extractCoinNamesAndSymbols(data);
                    resolve(currencyMap);
                } else {
                    logger.error("Error getting currency details", err);
                    reject(err);
                }
            });
        });
    }

    return this;
}


module.exports = api;
