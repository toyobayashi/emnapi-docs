# emnapi Runtime

Most APIs are implemented in JavaScript and they are depend on runtime code shipped in `library_napi.js` library file. So if you are building multiple wasm target, the same runtime code will be linked into each wasm glue js file. To "dynamic linking" the runtime code, that is, to share the runtime code among multiple wasm, you could do:

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

    You can specify `emnapiRuntime` explicitly, this step is optional:

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
