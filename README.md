# little-promise

little-promise是Promises/A+规范的一个实现，并且通过了Promises/A+的测试。

little-promise是一个精简小巧的，可读性高的Promises/A+实现。如你在使用中遇到问题，欢迎联系我：lehuading@qq.com

## 安装

```sh
$ npm install little-promise
```

## 测试

```sh
// 安装promises-aplus-tests和mocha
$ npm install
// 运行测试
$ npm test
```

## 文档

### 使用

```js
var LPromise = require('little-promise');
new LPromise(function (resolve, reject) {
    setTimeout(function () {
        resolve('success')
    }, 1000);
}).then(function (value) {
    // resolved
    console.log(value);
}, function (reason) {
    // rejected
    console.log(reason);
});
```

### 静态方法

除了上面实例中的基本使用方法，little-promise还提供了常见的串行和并行方法。

#### `all`

参数：little-promise实例或异步函数组成的数组
返回：一个little-promise实例p

promise数组同时运行。当所有promise都处于完成状态，p从等待状态（pending）变为完成状态（resolved）；当有promise处于失败状态，p从等待状态变为失败状态（rejected）。

示例：

```js
var LPromise = require('little-promise');
LPromise.all([
    new LPromise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 10);
    }),
    function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 20);
    },
    new LPromise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 30);
    })
]).then(function () {
    console.log('所有异步任务都完成了');
}, function () {
    console.log('有异步任务出错了');
});
```

#### `race`

参数：little-promise实例或异步函数组成的数组
返回：一个little-promise实例p

promise数组同时运行。当有一个promise处于完成状态，p从等待状态变为完成状态；当所有的promise处于失败状态，p从等待状态变为失败状态。

示例：

```js
var LPromise = require('little-promise');
LPromise.race([
    new LPromise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 10);
    }),
    function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 20);
    },
    new LPromise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 30);
    })
]).then(function () {
    console.log('有异步任务完成了');
}, function () {
    console.log('所有异步任务都出错了');
});
```

#### `step`

参数：异步函数组成的数组（注意与上面的方法传入的参数的区别，不能在转入little-promise实例）
返回：一个little-promise实例p

异步函数依次执行。当所有异步函数顺序执行完成后，p从等待状态变为完成状态；当有一个异步函数执行失败，p从等待状态变为失败状态。

```js
var LPromise = require('little-promise');
LPromise.all([
    function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 10);
    },
    function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 20);
    },
    function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 30);
    }
]).then(function () {
    console.log('所有异步任务依次完成了');
}, function () {
    console.log('有异步任务出错了');
});
```

### 调试

由于Promise规范的特点，对于`throw`报错的错误非常难调试。传给Promise的函数必须自己处理所有可能发生的错误，否则Promise自己会吃掉，并仅在返回的Promise实例中才能捕获。因此，我为了方便，添加了一个debug的静态方法。当调用`LPromise.debug()`时，所有位置的报错都会通过`console.error`丢出，可以快速找到出错位置。所以建议开发的时候调用`debug`接口。

如果你想一起来开发，欢迎和我联系：lehuading@qq.com。

<a href="http://promises-aplus.github.com/promises-spec">
    <img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png"
         align="right" alt="Promises/A+ logo" />
</a>

## Promises/A+ 规范

Promises/A+ 规范[英文]: https://github.com/promises-aplus/promises-spec

Promises/A+ 规范[中文]: http://www.ituring.com.cn/article/66566

感谢malnote的翻译[博客]: http://malcolmyu.github.io/malnote

## License

[MIT](https://opensource.org/licenses/MIT)