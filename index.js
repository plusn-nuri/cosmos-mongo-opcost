"use strict";
const Server = require('./server');
const CostChecker = require('./costChecker');

const url = process.argv[2] || process.env.COSMOS_CONNECTION_URL;

if(!url){ throw "MongoDB connection url should be specified either:\n  - The first argument to the application\n  - Environment variable COSMOS_CONNECTION_URL"}
const costChecker = new CostChecker(url);

const server = new Server(costChecker);

server.start();
