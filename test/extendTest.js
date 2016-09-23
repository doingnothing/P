var assert = require('assert');
var Promise = require('../little-promise');

describe('Promise', function () {
    describe('#all()', function () {
        it('同时运行所有Promise，当所有Promise完成时，整个过程就应该成功', function (done) {
            Promise.all([
                new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 10);
                }),
                function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 20);
                },
                new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 30);
                })
            ]).then(function () {
                done();
            });
        });
        it('同时运行所有Promise，只要有一个Promise失败，整个过程就应该失败', function (done) {
            Promise.all([
                new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 10);
                }),
                function (resolve, reject) {
                    setTimeout(function () {
                        reject();
                    }, 20);
                },
                new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 30);
                })
            ]).then(null, function () {
                done();
            });
        });
    });
    describe('#race()', function () {
        it('同时运行所有的Promise，只要有一个Promise完成，整个过程就应该完成', function (done) {

            Promise.race([
                new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 10);
                }),
                function (resolve, reject) {
                    setTimeout(function () {
                        reject();
                    }, 20);
                },
                new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 30);
                })
            ]).then(function () {
                done();
            });
        });
        it('同时运行所有的Promise，所有Promise失败，整个过程就应该失败', function (done) {

            Promise.race([
                new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        reject();
                    }, 10);
                }),
                function (resolve, reject) {
                    setTimeout(function () {
                        reject();
                    }, 20);
                },
                new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        reject();
                    }, 30);
                })
            ]).then(null, function () {
                done();
            });
        });
    });
    describe('#step()', function () {
        it('按顺序依次运行每个Promise，依次执行完每个Promise之后，整个过程就应该完成', function (done) {

            Promise.step([
                function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 10);
                },
                function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 10);
                },
                function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 10);
                }
            ]).then(function () {
                done();
            });
        });
        it('按顺序依次运行每个Promise，出现Promise失败，整个过程就应该失败', function (done) {

            Promise.step([
                function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 10);
                },
                function (resolve, reject) {
                    setTimeout(function () {
                        reject();
                    }, 10);
                },
                function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 10);
                }
            ]).then(null, function () {
                done();
            });
        });
    });
});

Promise.all([
    new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 10);
    }),
    new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 20);
    }),
    new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 30);
    })
]).then(function () {
    done();
});