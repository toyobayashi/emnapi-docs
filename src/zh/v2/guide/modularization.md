# 模块化

默认情况下，Emscripten 以直接的方式将所有代码发送到输出到 .js 文件中。这意味着如果在网页的脚本标签中加载它，它将使用全局范围。

```js
// 输出的 js

var Module = typeof Module !== "undefined" ? Module : {};

// var ...

function run(args) {
  // ...
}

run();
```

## 设置 `MODULARIZE`

你可以设置 `-sMODULARIZE` 和 `-sEXPORT_NAME=createModule` 来告诉 Emscripten 输出 UMD 模块，代码包装在返回 Promise 的工厂函数中。

```js
var createModule = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(createModule) {
  createModule = createModule || {};

var Module = typeof createModule !== "undefined" ? createModule : {};

// ...

Module["ready"] = new Promise(function(resolve, reject) {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});

function run(args) {
  // ...
}

run();

  return createModule.ready;

}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = createModule;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return createModule; });
else if (typeof exports === 'object')
  exports["createModule"] = createModule;
```

返回的 Promise 在 wasm 编译完成时成功解析 Module 对象，类似于 `onRuntimeInitialized` 回调。使用 `-sMODULARIZE` 时不需要使用 `onRuntimeInitialized` 回调。

工厂函数接受 1 个参数，一个具有 Module 默认值的对象：

```js
createModule({
  // Emscripten module init options
}).then((Module) => {
  const binding = Module.emnapiInit({ context })
})

// or

const Module = await createModule({
  // Emscripten module init options
})
const binding = Module.emnapiInit({ context })
```
