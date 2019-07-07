"use strict";

var { Pool, Client } = require('pg');
var config = require('../configuration/config.js');

function datastore(logger) {
    // Get connection strings from configuration
    var pool = new Pool(config.database);

    // methods to manipulate holdings
    this.holding = {};
    // delete an existing holding
    this.holding.delete = (holdingId) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT holding_delete($1)', [ holdingId ], (err, res) => { 
                if (err) {
                    logger.error("Error deleting holding ", err);
                    reject(err)
                } else {
                    if (res.rows[0].holding_delete == null) {
                        logger.info("Portfolio Holding Id not found");
                        reject("Not found");
                    } else {
                        logger.info("Updated successfully");
                        resolve(true);
                    }
                }
            });
        });
    };

    // create a new holding
    this.holding.create = (holdingId, coin, amount) => {
        logger.info("Adding coin to holding");
        return new Promise((resolve, reject) => {
            pool.query('SELECT holding_create($1, $2, $3)', [ holdingId, coin, amount ], (err, res) => { 
                if (err) {
                    logger.error("Error adding holding", err);
                    reject(err)
                } else {
                    if (res.rows[0].holding_create == null) {
                        logger.info("Error holding already exists");
                        reject("Already exists");
                    } else {
                        logger.info("Updated successfully");
                        resolve(true);
                    }
                }
            });
        });
    }

    // update the amount of an existing holding
    this.holding.update = (holdingId, newAmount) => {
        logger.info("Updating portfolio");
        return new Promise((resolve, reject) => {
            pool.query('SELECT holding_update_amount($1, $2)', [ holdingId, newAmount ], (err, res) => { 
                if (err) {
                    logger.error("Error updating holding", err);
                    reject(err)
                } else {
                    if (res.rows[0].holding_update_amount == null) {
                        logger.info("Holding id not found");
                        reject("Not found");
                    } else {
                        logger.info("Updated successfully");
                        resolve(true);
                    }
                }
            });
        });
    }


    // methods to manipulate portfolios
    this.portfolio = {};
    this.portfolio.read = (portfolioId) => {
        logger.info("Getting holdings for portfolio");
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM holding_read($1)', [portfolioId], (err, res) => {
                if (err) {
                    logger.error("Error getting portfolio holdings", err);
                    reject(err)
                } else {
                    logger.info("Got", res.rows.length, "records successfully");
                    resolve(res.rows);
                }
            });
        });
    }

    this.portfolio.list = () => {
        logger.info("Getting portfolio list");
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM portfolio p', (err, res) => {
                if (err) {
                    logger.error("Error getting portfolio list", err);
                    reject(err)
                } else {
                    logger.info("Got", res.rows.length, "records successfully");
                    resolve(res.rows);
                }
            });
        });
    }

    // create a new portfolio
    this.portfolio.create = (name) => {
        logger.info("Creating new portfolio");
        return new Promise((resolve, reject) => {
            pool.query('SELECT portfolio_create($1)', [name], (err, res) => {
                if (err) {
                    logger.error("Error getting portfolio coins", err);
                    reject(err);
                } else {
                    if (res.rows[0].portfolio_create == null) {
                        logger.info("Error creating new portfolio");
                        reject("Error creating portfolio");
                    } else {
                        logger.info("Created new portfolio successfully");
                        resolve(res.rows[0].portfolio_create);
                    }
                }
            });
        });
    }

    return this;
}


module.exports = datastore;