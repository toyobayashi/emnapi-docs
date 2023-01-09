# emnapi Runtime

Most APIs are implemented in JavaScript and they are depend on runtime code shipped in `library_napi.js` library file. So if you are building multiple wasm target, the same runtime code will be linked into each wasm glue js file. This is problematic when passing JavaScript objects across wasm bindings in same web page, we need to share emnapi's runtime code between multiple wasms like this:

1. Installing emnapi runtime

    ```bash
    npm install @tybys/emnapi-runtime
    ```

2. Linking no runtime library build

    - emcc

      ```bash
      emcc ... --js-library=./node_modules/@tybys/emnapi/dist/library_napi_no_runtime.js
      ```

    - cmake

      ```cmake
      add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/node_modules/@tybys/emnapi")
      target_link_libraries(hello emnapi_noruntime)
      ```

3. Importing runtime code

    - Browser

        ```html
        <script src="node_modules/@tybys/emnapi-runtime/dist/emnapi.min.js"></script>
        <script src="your-wasm-glue.js"></script>
        ```
    
    - Node.js

        Just npm install `@tybys/emnapi-runtime` 

4. (Optional) You can specify `emnapiRuntime` and `emnapiContext` explicitly

    ```html
    <script src="node_modules/@tybys/emnapi-runtime/dist/emnapi.min.js"></script>
    <script>
      var Module = { /* ... */ };
      Module.emnapiRuntime = window.emnapi;
      var __emnapi_context__ = window.emnapi.createContext();
      Module.emnapiContext = __emnapi_context__;

      // can be function or async function
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

`@tybys/emnapi-runtime` version should match `@tybys/emnapi` version.
