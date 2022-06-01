# Modularization

By default Emscripten emit all code in a straightforward way into the output
.js file. That means that if you load that in a script tag in a web
page, it will use the global scope. 

```js
// the output js

var Module = typeof Module !== "undefined" ? Module : {};

// var ...

function run(args) {
  // ...
}

run();
```

## Using `MODULARIZE` Setting

You can set `-sMODULARIZE` and `-sEXPORT_NAME=createModule` to tell Emscripten to
emit UMD module, the code is wrapped in the exported factory function that returns a promise.

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

The returned promise is resolved with the module instance when it is safe to run the compiled code,
similar to the `onRuntimeInitialized` callback. You do not need to use the
`onRuntimeInitialized` callback when using `-sMODULARIZE`.

The factory function accepts 1 parameter, an object with default values for
the module instance, you can set emnapi runtime or initialization callback here:

```js
createModule({
  emnapiRuntime: window.__emnapi_runtime__,
  onEmnapiInitialized (err, emnapiExports) {
    // ...
  }
}).then((Module) => {
  // access Module.emnapiExports
})

// or

const Module = await createModule({
  emnapiRuntime: window.__emnapi_runtime__,
  onEmnapiInitialized: function (err, emnapiExports) {
    // ...
  }
})
```

## Using `emwrap`

I built another Node.js CLI application named [emwrap](https://github.com/toyobayashi/emwrap) for more flexible modularization.

Features:

- Support wrapping Emscripten code to UMD / CommonJS / ESM / Node.js ESM format
- Support `WXWebAssembly` in WeChat miniprogram environment
- Cache the promise result, means that fetch and compile wasm only once when calling factory function multiple times

```bash
npm install -D @tybys/emwrap
```

::: tip

You should avoid passing `-sMODULARIZE=1` or `-o mjs` extension to emcc / em++.

:::

You can use [`--js-transform`](https://emscripten.org/docs/tools_reference/emcc.html#emcc-minify) option:

```bash
emcc -o glue.js -O3 --js-transform "emwrap --name=myWasmLib" main.c
```

Windows:

```bat
emcc -o glue.js -O3 --js-transform "emwrap.cmd --name=myWasmLib" main.c
```

or in two steps:

```bash
emcc -o glue.js -O3 main.c
emwrap --name=myWasmLib --minify glue.js
```

Browser `<script>`:

```html
<script src="glue.js"></script>
<script>
  myWasmLib.default().then(function (ctx) {
    var Module = ctx.Module;
    Module.myfunction();
  });
</script>
```

Webpack:

```js
import init from './glue.js'
// const init = require('./glue.js').default
init().then(({ Module }) => { Module.myfunction() })
```

CMake:

```cmake
add_custom_command(TARGET yourtarget POST_BUILD
  COMMAND npx emwrap "--name=umdname" "$<TARGET_FILE:yourtarget>"
  # COMMAND node "./other-script.js"
)
```
