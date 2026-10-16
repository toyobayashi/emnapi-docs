# Getting Started

This section will help you build a Hello World example by using emnapi.

## Environment Requires

You will need to install:

- Node.js `>= v22.12.0`
- npm `>= v8`
- Emscripten `>= v4.1.7`, or wasi-sdk `>= v26`; use LLVM clang with wasm support for the bare `wasm32` target
- CMake `>= v3.13` if building with CMake
- node-gyp `>= v10.2.0` if building with node-gyp
- ninja or make, as required by your build system
- Optional: [node-addon-api](https://github.com/nodejs/node-addon-api) `>= 6.1.0`

::: tip
Set `$EMSDK` environment variable to the emsdk root path.

Add `$EMSDK/upstream/emscripten` to `$PATH` environment variable.
:::

::: tip
There are several choices to get `make` for Windows user

- Install [mingw-w64](https://www.mingw-w64.org/downloads/), then use `mingw32-make`
- Download [MSVC prebuilt binary of GNU make](https://github.com/toyobayashi/make-win-build/releases), add to `%Path%` then rename it to `mingw32-make`
- Install [Visual Studio 2022](https://visualstudio.microsoft.com/) C++ desktop workload, use `nmake` in `Visual Studio Developer Command Prompt`
- Install [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/), use `nmake` in `Visual Studio Developer Command Prompt`
:::

For wasi-sdk, set the `WASI_SDK_PATH` environment variable to the wasi-sdk installation directory.

Verify your environment:

```bash
node -v
npm -v
emcc -v

# clang -v
# clang -print-targets # ensure wasm32 target exists

cmake --version

# if you use ninja
ninja --version

# if you use make
make -v

# if you use nmake in Visual Studio Developer Command Prompt
nmake /?
```

## Installation

```bash
npm install -D emnapi@2.0.0-beta.2 @emnapi/runtime@2.0.0-beta.2

# for WASI or other non-Emscripten instantiation
npm install @emnapi/core@2.0.0-beta.2

# if you use node-addon-api
npm install node-addon-api
```

::: tip

Each package should match the same version.

:::

## Writing Source Code

Create `hello.c`

```c
#include <node_api.h>

#define NAPI_CALL(env, the_call)                                \
  do {                                                          \
    if ((the_call) != napi_ok) {                                \
      const napi_extended_error_info *error_info;               \
      napi_get_last_error_info((env), &error_info);             \
      bool is_pending;                                          \
      const char* err_message = error_info->error_message;      \
      napi_is_exception_pending((env), &is_pending);            \
      if (!is_pending) {                                        \
        const char* error_message = err_message != NULL ?       \
          err_message :                                         \
          "empty error message";                                \
        napi_throw_error((env), NULL, error_message);           \
      }                                                         \
      return NULL;                                              \
    }                                                           \
  } while (0)

static napi_value js_hello(napi_env env, napi_callback_info info) {
  napi_value world;
  const char* str = "world";
  NAPI_CALL(env, napi_create_string_utf8(env, str, NAPI_AUTO_LENGTH, &world));
  return world;
}

NAPI_MODULE_INIT() {
  napi_value hello;
  NAPI_CALL(env, napi_create_function(env, "hello", NAPI_AUTO_LENGTH,
                                      js_hello, NULL, &hello));
  NAPI_CALL(env, napi_set_named_property(env, exports, "hello", hello));
  return exports;
}
```

The C code is equivalant to the JavaScript below:

```js
module.exports = (function (exports) {
  const hello = function hello () {
    // native code in js_hello
    const world = 'world'
    return world
  }

  exports.hello = hello
  return exports
})(module.exports)
```

## Building Source Code

::: code-group

```bash [emscripten]
emcc -O3 -pthread \
     -DBUILDING_NODE_EXTENSION \
     "-DNAPI_EXTERN=__attribute__((__import_module__(\"env\")))" \
     -I./node_modules/emnapi/include/node \
     -L./node_modules/emnapi/lib/wasm32-emscripten \
     --js-library=./node_modules/emnapi/dist/library_napi.js \
     -sWASM_BIGINT=1 \
     -sALLOW_MEMORY_GROWTH=1 \
     -sALLOW_TABLE_GROWTH=1 \
     -sEXPORTED_FUNCTIONS=$(node -p "JSON.stringify(require('emnapi').requiredConfig.emscripten.settings.EXPORTED_FUNCTIONS)") \
     -sEXPORTED_RUNTIME_METHODS=$(node -p "JSON.stringify(require('emnapi').requiredConfig.emscripten.settings.EXPORTED_RUNTIME_METHODS)") \
     -sEXPORT_ES6=1 \
     -sPTHREAD_POOL_SIZE=4 \
     -o out/hello.js \
     hello.c \
     -lemnapi-mt
```

```bash [wasi-sdk]
"$WASI_SDK_PATH/bin/clang" --target=wasm32-wasip1-threads -O3 \
    -pthread -matomics -mbulk-memory \
    -DBUILDING_NODE_EXTENSION \
    -I./node_modules/emnapi/include/node \
    -L./node_modules/emnapi/lib/wasm32-wasip1-threads-wasi-sdk-34 \
    --sysroot="$WASI_SDK_PATH/share/wasi-sysroot" \
    -mexec-model=reactor \
    -Wl,--initial-memory=16777216 \
    -Wl,--max-memory=4294967296 \
    -Wl,--import-memory -Wl,--shared-memory -Wl,--export-memory \
    -Wl,--export-table -Wl,--growable-table \
    -Wl,--export=malloc,--export=free \
    -Wl,--export=napi_register_wasm_v1 \
    -Wl,--export=emnapi_create_env,--export=emnapi_delete_env \
    -Wl,--export-if-defined=node_api_module_get_api_version_v1 \
    -Wl,--export-if-defined=uv_library_shutdown \
    -Wl,--export=emnapi_thread_crashed \
    -Wl,--import-undefined \
    -o out/hello.wasm \
    hello.c \
    -lemnapi-mt
```

```bash [clang]
# Choose `libdlmalloc.a` or `libemmalloc.a` for `malloc` and `free`.

clang -O3 \
      -DBUILDING_NODE_EXTENSION \
      -I./node_modules/emnapi/include/node \
      -L./node_modules/emnapi/lib/wasm32 \
      --target=wasm32 \
      -nostdlib \
      -Wl,--no-entry \
      -Wl,--initial-memory=16777216 \
      -Wl,--export-dynamic \
      -Wl,--export=malloc \
      -Wl,--export=free \
      -Wl,--export=napi_register_wasm_v1 \
      -Wl,--export-if-defined=node_api_module_get_api_version_v1 \
      -Wl,--import-undefined \
      -Wl,--export-table \
      -o hello.wasm \
      hello.c \
      -lemnapi \
      -ldlmalloc # -lemmalloc
```

:::

For wasi-sdk 33 or older, use the `wasm32-wasip1-threads` library directory instead of `wasm32-wasip1-threads-wasi-sdk-34`. Match the library directory to the wasi-sdk used for linking.

## Initialization

emnapi keeps JavaScript values and Node-API handles in a runtime Context. Create one context for each group of modules that should share those handles, then pass it to emnapi.

::: details Emscripten

The Emscripten build above exports an ES module factory. Wait for the factory to resolve before calling Module.emnapiInit; initialization succeeds once and returns the addon's exports.

~~~js
import init from './out/hello.js'
import { createContext } from '@emnapi/runtime'

const Module = await init()
const binding = Module.emnapiInit({ context: createContext() })
console.log(binding.hello())
~~~

This form works in Node.js and in a browser build that bundles the ESM imports.

:::

::: details wasi-sdk or clang

For a bare wasm32 build, use instantiateAddon from @emnapi/core. It returns the loaded WebAssembly instance and its addonModule; the addon's exports are on addonModule.exports.

~~~js
import { instantiateAddon } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'

const wasmBytes = await (await fetch('./hello.wasm')).arrayBuffer()
const { addonModule } = await instantiateAddon(wasmBytes, {
  context: createContext()
})
const binding = addonModule.exports
console.log(binding.hello())
~~~

For a Node.js WASI build, pass a WASI instance as well:

~~~js
import { instantiateAddon } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'
import { readFile } from 'node:fs/promises'
import { WASI } from 'node:wasi'

const { addonModule } = await instantiateAddon(
  await readFile('./out/hello.wasm'),
  {
    wasi: new WASI({ version: 'preview1' }),
    context: createContext(),
    overwriteImports(importObject) {
      importObject.env.memory = new WebAssembly.Memory({
        initial: 256,
        maximum: 65536,
        shared: true
      })
    }
  }
)
const binding = addonModule.exports
console.log(binding.hello())
~~~

The WASI pthread build shown above needs worker setup when the addon starts child threads. See [Multithreaded Asynchronous Operations](/v2/guide/multithreaded-async.html) for worker and shared-memory configuration. Browsers must load these ESM packages through a bundler; the packages do not expose the old classic-script UMD globals.

For a plain wasm32-wasip1 build that uses napi_create_async_work or thread-safe functions, pass a WASI instance and provide the JavaScript implementations:

~~~js
import { instantiateAddon } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'
import asyncWork from '@emnapi/core/plugins/async-work'
import threadSafeFunction from '@emnapi/core/plugins/threadsafe-function'
import { WASI } from 'node:wasi'

const { addonModule } = await instantiateAddon(wasmBytes, {
  wasi: new WASI({ version: 'preview1' }),
  context: createContext(),
  plugins: [asyncWork, threadSafeFunction]
})
~~~

:::
