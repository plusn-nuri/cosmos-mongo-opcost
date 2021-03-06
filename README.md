﻿# CosmosDB MongoDB Operation Cost Estimator

## Synopsis
This tool helps check the cost of an operation against CosmosDB when using the MongoDB driver.

CosmosDB is a multi-API product, offering an (experimental at the time of writing) API matching the MongoDB wire protocol. This lets you write applications that use the MongoDB syntax and drivers, yet point to a CosmosDB collections rather than a MongoDB server backend.

Since CosmosDB has a pricing model that is based on RU, it's important to figure out your costs, hopefully before hitting full blown production. This tool helps you run specific commands, and see the RU estimate for that command.

## Disclaimer
- __This is only an estimate.__
- __This is not accurate: your costs in production may vary, in any direction, by any magnitude.__
- __Refer to [Azure CosmosDB Documentation](https://azure.microsoft.com/en-us/pricing/details/cosmos-db/) for explanation of pricing and SKU offering.
- __This tool only helps understand the cost associated with executing a specific command. It does not include storage, networking or other costs__

## Usage

1. Clone the project locally.
1. Run `npm install` to install the dependencies
1. Run `node index.js`

The tool needs a connection string. You can specify the connection as the third parameter at the command line, or by setting an environment variable *COSMOS_CONNECTION_URL*.

> The MongoDB connection URL for CosmosDB does not include a database name by default. In order for this tool to work, the URL must contain a database name. For example, `mongodb://<user+password+host>/mydbname?<options>` includes the database name "_mydbname_".

The once running, point your browser to http://localhost/

- Select the collection name.
- Select _aggregate_ or _find_ expression type.
- Type in the _expression_.
- Hit the _check_ button.

The cost and the aggregation / find result will appear.

