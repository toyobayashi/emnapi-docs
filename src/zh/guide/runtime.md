# emnapi 运行时

emnapi 的绝大多数 API 都是用 JavaScript 实现的，它们依赖于 `library_napi.js` 库文件中提供的运行时代码。因此，如果要构建多个 wasm 目标在同一个页面下运行，则相同的运行时代码将链接到每个 wasm 胶水 js 文件中，这在跨 wasm binding 传递 JavaScript 对象时会出现问题，我们需要在多个 wasm 之间共享 emnapi 的运行时代码，要像下面这样做：

1. 安装 emnapi 运行时

    ```bash
    npm install @tybys/emnapi-runtime
    ```

2. 链接无运行时的库文件

    - emcc

      ```bash
      emcc ... --js-library=./node_modules/@tybys/emnapi/dist/library_napi_no_runtime.js
      ```

    - cmake

      ```cmake
      add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/node_modules/@tybys/emnapi")
      target_link_libraries(hello emnapi_noruntime)
      ```

3. 导入运行时

    - 浏览器

        ```html
        <script src="node_modules/@tybys/emnapi-runtime/dist/emnapi.min.js"></script>
        <script src="your-wasm-glue.js"></script>
        ```
    
    - Node.js

        Just npm install `@tybys/emnapi-runtime` 

4. (可选的) 也可以显式指定 `emnapiRuntime` 和 `emnapiContext`：

    ```html
    <script src="node_modules/@tybys/emnapi-runtime/dist/emnapi.min.js"></script>
    <script>
      var Module = { /* ... */ };
      Module.emnapiRuntime = window.emnapi;
      var __emnapi_context__ = window.emnapi.createContext();
      Module.emnapiContext = __emnapi_context__;

      // 可以是同步函数也可以是返回 Promise 的异步函数
      Module.emnapiRuntime = function () { return window.emnapi; };
      Module.emnapiRuntime = function () { return Promise.resolve(window.emnapi); };
      Module.emnapiContext = function (emnapiRuntime) { /* ... */ };
      Module.emnapiContext = async function (emnapiRuntime) { /* ... */ };
    </script>
    <script src="your-wasm-glue.js"></script>
    ```

    ```js
    // Node.js CJS
    const emnapi = require('@tybys/emnapi-runtime')
    const Module1 = require('./your-wasm-glue1.js')
    const Module2 = require('./your-wasm-glue2.js')
    const ctx = emnapi.createContext()
    Module1.emnapiRuntime = emnapi
    Module1.emnapiContext = ctx
    Module2.emnapiRuntime = emnapi
    Module2.emnapiContext = ctx
    ```

`@tybys/emnapi-runtime` 版本应与 `@tybys/emnapi` 版本保持一致。
