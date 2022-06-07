const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

//this is the original copy of exac form monogodb
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {

    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );

    //see if we have a value for 'key' in redis
    const cacheValue = await client.get(key);

    //if we do, return that 
    if(cacheValue){
        // console.log(cacheValue);
        const doc =new this.model(JSON.parse(cacheValue));

        return doc;
    }

    //otherwise, issue the query and store the result in redis
    const result = exec.apply(this, arguments);

    console.log(result);
    client.set(key, JSON.stringify(result));
    
    return result;
}

