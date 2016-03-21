# DPromise

DPromise是Promises/A+规范的一个实现，并且通过了Promises/A+的测试。

DPromise是一个精简小巧的，可读性高的Promises/A+实现。如你在使用中遇到问题，欢迎联系我：lehuading@qq.com

## 安装

```sh
$ npm install d-promise
```

## 测试

```sh
// 安装promises-aplus-tests
$ npm install
// 运行测试
$ npm test
```

## 文档

### 使用

```js
var DPromise = require('d-promise');
new DPromise(function (resolve, reject) {
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

### 接口

DPromise实现了一个符合Promise/A+规范的最小库。
为了简化流程处理，今后会添加串行、并行和一些约定俗成的接口。
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