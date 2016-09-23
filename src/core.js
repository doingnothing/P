(function (root) {
    // 工具函数
    var isFunction = function (value) {
        return (typeof value === 'function');
    };
    var isObject = function (value) {
        return (typeof value === 'object' && value !== null);
    };
    var async = function (fun) {
        setTimeout(fun, 0);
    };

    // 队列结构
    function Queue() {
        var o = this;
        o._head = o._tail = null;
    }

    Queue.prototype = {
        enqueue: function (ele) {
            var o = this;
            var one = {
                ele: ele,
                next: null
            };
            if (o._head === null) {
                o._head = this._tail = one;
            } else {
                o._tail.next = one;
                o._tail = o._tail.next;
            }
        },
        dequeue: function () {
            var o = this;
            if (o._head === null) {
                throw new Error('queue is empty');
            }
            var res = o._head.ele;
            o._head = o._head.next;
            return res;
        },
        isEmpty: function () {
            var o = this;
            return o._head === null;
        },
        clear: function () {
            var o = this;
            o._head = o._next = null;
        },
        each: function (cb) {
            var o = this;
            if (!o.isEmpty()) {
                cb(o.dequeue());
                o.each(cb);
            }
        }
    };

    // Promise解决过程[[Resolve]](promise, x)
    var _Resolve_ = function (promise, x) {
        if (promise === x) {
            promise._reject(new TypeError());
        } else if (x instanceof Promise) {
            x.then(function (value) {
                _Resolve_(promise, value);
            }, function (reason) {
                promise._reject(reason);
            });
        } else if (isFunction(x) || isObject(x)) {
            var then;
            try {
                then = x.then;
            } catch (e) {
                Promise.catch(e);
                promise._reject(e);
                return;
            }

            var flag = false;
            if (isFunction(then)) {
                try {
                    then.call(x, function (y) {
                        if (flag) {
                            return;
                        }
                        flag = true;
                        _Resolve_(promise, y);
                    }, function (r) {
                        if (flag) {
                            return;
                        }
                        flag = true;
                        promise._reject(r);
                    })
                } catch (e) {
                    if (flag) {
                        return;
                    }
                    flag = true;
                    promise._reject(e);
                }
            } else {
                promise._resolve(x);
            }
        } else {
            promise._resolve(x);
        }
    };

    // Promise对象
    function Promise(asyncJob) {
        var o = this;
        o._state = o.PENDING;
        o._q1 = new Queue();
        o._q2 = new Queue();
        if (isFunction(asyncJob)) {
            try {
                asyncJob(function (value) {
                    o._resolve(value)
                }, function (reason) {
                    o._reject(reason);
                });
            } catch (e) {
                Promise.catch(e);
            }
        }
    }

    var debug = false;

    Promise.debug = function () {
        debug = true;
    };

    Promise.catch = function (e) {
        if (debug) {
            console.error(e);
        }
    };

    Promise.prototype = {

        PENDING: 0,
        RESOLVED: 1,
        REJECTED: -1,

        _resolve: function (value) {
            var o = this;
            if (o._state !== o.PENDING) {
                return;
            }
            o._state = o.RESOLVED;
            o._value = value;
            o._run();
        },

        _reject: function (reason) {
            var o = this;
            if (o._state !== o.PENDING) {
                return;
            }
            o._state = o.REJECTED;
            o._reason = reason;
            o._run();
        },

        _run: function () {
            var o = this;
            var q, arg, state = o._state;
            if (state === o.RESOLVED) {
                q = o._q1;
                o._q2.clear();
                arg = o._value;
            } else if (state === o.REJECTED) {
                q = o._q2;
                o._q1.clear();
                arg = o._reason;
            }
            q.each(function (fun) {
                async(function () {
                    fun(state, arg);
                });
            });
        },

        _return_: function (state, handler, arg) {

            var o = this;

            async(function () {

                if (isFunction(handler)) {

                    var x;

                    try {
                        x = handler(arg);
                    } catch (e) {
                        Promise.catch(e);
                        o._reject(e);
                        return;
                    }

                    _Resolve_(o, x);

                } else {
                    if (state === o.RESOLVED) {
                        o._resolve(arg);
                    } else if (state === o.REJECTED) {
                        o._reject(arg);
                    }
                }
            });

        },

        then: function (onResolved, onRejected) {

            var o = this;

            var p2 = new Promise();

            o._q1.enqueue(function (state, value) {
                p2._return_(state, onResolved, value);
            });

            o._q2.enqueue(function (state, reason) {
                p2._return_(state, onRejected, reason);
            });

            if (o._state === o.RESOLVED) {
                o._run();
            } else if (o._state === o.REJECTED) {
                o._run();
            }

            return p2;
        }
    };


    // 并行，所有完成才算完成
    Promise.all = function (jobs) {
        return new Promise(function (resolve, reject) {
            var max = jobs.length;
            var count = 0;
            var flag = false;
            var values = [];

            function check(err, value, index) {
                if (flag) {
                    return;
                }
                if (err !== null) {
                    flag = true;
                    reject(err);
                }
                values[index] = value;
                count += 1;
                if (count === max) {
                    flag = true;
                    resolve(values);
                }
            }

            for (var i = 0; i < max; i = i + 1) {
                (function (index) {
                    var job = jobs[index];
                    if (!(job instanceof Promise)) {
                        job = new Promise(job);
                    }
                    job.then(function (value) {
                        check(null, value, index);
                    }, function (reason) {
                        check(reason || true);
                    });
                }(i));
            }
        })
    };

    // 并行，只要有一个完成就算完成
    Promise.race = function (jobs) {
        return new Promise(function (resolve, reject) {

            var max = jobs.length;
            var flag = false;
            var count = 0;

            function check(err, value) {
                if (flag) {
                    return;
                }
                if (err == null) {
                    flag = true;
                    resolve(value);
                } else {
                    count += 1;
                    if (count >= max) {
                        flag = true;
                        reject(err);
                    }
                }
            }

            for (var i = 0; i < max; i = i + 1) {
                (function (index) {
                    var job = jobs[index];
                    if (!(job instanceof Promise)) {
                        job = new Promise(job);
                    }
                    job.then(function (value) {
                        check(null, value, index);
                    }, function (reason) {
                        check(reason || true);
                    });
                }(i));
            }
        })
    };


    // 串行
    Promise.step = function (jobs) {

        var max = jobs.length;

        var p2 = new Promise();

        var next = function (at, value) {
            if (at >= max) {
                return p2._resolve(value);
            }
            new Promise(jobs[at]).then(function (value) {
                next(at + 1, value)
            }, function (reason) {
                p2._reject(reason);
            })
        };
        new Promise(jobs[0]).then(function (value) {
            next(1, value);
        }, function (reason) {
            p2._reject(reason);
        });

        return p2;
    };

    if (module && module.exports) {
        module.exports = exports = Promise;
    } else {
        root.LittlePromise = Promise;
    }

})(this);