"use strict";
const Server = require('./server');
const CostChecker = require('./costChecker');

const costChecker = new CostChecker(process.env.COSMOS_CONNECTION_URL);

const server = new Server(costChecker);

server.start();
