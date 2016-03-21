var promisesAplusTests = require("promises-aplus-tests");

var Promise = require('../d-promise');

var adapter = {};
adapter.resolved = function (value) {
    return new Promise(function (resolve, reject) {
        resolve(value);
    });
};
adapter.rejected = function (reason) {
    return new Promise(function (resolve, reject) {
        reject(reason);
    });
};
adapter.deferred = function () {
    var p = new Promise();
    return {
        promise: p,
        resolve: function (value) {
            p._resolve(value);
        },
        reject: function (reason) {
            p._reject(reason);
        }
    }
};


promisesAplusTests(adapter, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("all passed");
    }
});