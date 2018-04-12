'use strict';
const { URL } = require('url');
const { MongoClient } = require('mongodb');

class CostChecker {
    constructor(connection) {
        this.connection = connection;
        this.dbName = new URL(connection).pathname.substring(1);
    }

    async check(collectionName, expression, commandName) {
        CostChecker.validate(expression, commandName);
        const client = await MongoClient.connect(this.connection);
        const db = client.db(this.dbName);
        const collection = db.collection(collectionName);

        const cursor = await collection[commandName](expression);
        
        const results = await cursor.toArray();

        const cost = await db.executeDbAdminCommand({ getLastRequestStatistics: 1 });
        
        return { results: results, cost: cost };
    }

    async listCollections(){
        const client = await MongoClient.connect(this.connection);
        const db = client.db(this.dbName);
        const crs = await db.listCollections();
        return await crs.toArray();        
    }

    static validate(expression, commandName) {
        if (!(commandName === "aggregate" || commandName == "find")) {
            throw ValidationException(`Command name ${commandName} is not one of 'aggregate' or 'find'.`);
        }
        const expressionIsArray = Array.isArray(expression);
        if (commandName == "aggregate") {

            if (!expressionIsArray) {
                throw ValidationException("Aggregation expression must be an array of pipeline stages")
            }
            expression.forEach(e => {
                const keys = Object.keys(e);
                
                if(keys.length!==1){
                    throw ValidationException(`Pipeline stage must have exactly one $<stage> key, but got [${keys.join(',')}]`)
                }

                const stage = keys.pop();
                if (!stage.match(/^\$(project|match|limit|skip|unwind|group|sample|sort|lookup|out|count|addFields)$/)) {
                    throw ValidationException(`Unsupported pipeline stage ${stage}`);
                }
            });
        }

        if (commandName == "find") {
            if (expressionIsArray) {
                throw ValidationException(`Find should not be called with an array`);
            }
        }
    }
}

function ValidationException(msg) {
    return {
        message: msg,
        name: "Validation Error"
    };
}

module.exports = CostChecker;