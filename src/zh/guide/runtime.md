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

    也可以显式指定 `emnapiRuntime`，这一步是可选的：

    ```html
    <script src="node_modules/@tybys/emnapi-runtime/dist/emnapi.min.js"></script>
    <script>
      var Module = { /* ... */ };
      Module.emnapiRuntime = window.__emnapi_runtime__;
    </script>
    <script src="your-wasm-glue.js"></script>
    ```

    ```js
    // Node.js
    Module.emnapiRuntime = require('@tybys/emnapi-runtime')
    ```

`@tybys/emnapi-runtime` 版本应与 `@tybys/emnapi` 版本保持一致。
