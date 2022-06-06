const mongoose = require('mongoose');

//this is the original copy of exac form monogodb
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {
    console.log('IM ABOUT TO RUN A QUERY');
    
    const key =Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    });

    console.log(key);

    return exec.apply(this, arguments);
}

