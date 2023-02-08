# Getting Started

This section will help you build a Hello World example by using emnapi.

## Environment Requires

You will need to install:

- Node.js `>= v16.15.0`
- npm `>= v8`
- Emscripten `>= v3.1.9` / wasi-sdk / LLVM clang with wasm support
- (Optional) CMake `>= v3.13`
- (Optional) ninja
- (Optional) make

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
npm install -D @tybys/emnapi
npm install @tybys/emnapi-runtime

# for non-emscripten
npm install @tybys/emnapi-core
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

## Buiding Source Code

::: code-group

```bash [emscripten]
emcc -O3 \
     -I./node_modules/@tybys/emnapi/include \
     -L./node_modules/@tybys/emnapi/lib/wasm32-emscripten \
     --js-library=./node_modules/@tybys/emnapi/dist/library_napi.js \
     -sEXPORTED_FUNCTIONS="['_malloc','_free']" \
     -o hello.js \
     hello.c \
     -lemnapi
```

```bash [wasi-sdk]
clang -O3 \
      -I./node_modules/@tybys/emnapi/include \
      -L./node_modules/@tybys/emnapi/lib/wasm32-wasi \
      --target=wasm32-wasi \
      --sysroot=$WASI_SDK_PATH/share/wasi-sysroot \
      -mexec-model=reactor \
      -Wl,--initial-memory=16777216 \
      -Wl,--export-dynamic \
      -Wl,--export=malloc \
      -Wl,--export=free \
      -Wl,--export=napi_register_wasm_v1 \
      -Wl,--import-undefined \
      -Wl,--export-table \
      -o hello.wasm \
      hello.c \
      -lemnapi
```

```bash [clang]
# You can link against `@tybys/emnapi/lib/wasm32/libdlmalloc.a`
# for `malloc` and `free`

clang -O3 \
      -I./node_modules/@tybys/emnapi/include \
      -L./node_modules/@tybys/emnapi/lib/wasm32 \
      --target=wasm32 \
      -nostdlib \
      -Wl,--no-entry \
      -Wl,--initial-memory=16777216 \
      -Wl,--export-dynamic \
      -Wl,--export=malloc \
      -Wl,--export=free \
      -Wl,--export=napi_register_wasm_v1 \
      -Wl,--import-undefined \
      -Wl,--export-table \
      -o hello.wasm \
      hello.c \
      -lemnapi \
      -ldlmalloc
```

:::

## Initialzation

To initialize emnapi, you need to import the emnapi runtime to create a `Context` by `createContext` first.
Each context owns isolated Node-API object such as `napi_env`, `napi_value`, `napi_ref`. If you have multiple emnapi modules, you should reuse the same `Context` across them. 

```ts
declare namespace emnapi {
  // module '@tybys/emnapi-runtime'
  export class Context { /* ... */ }
  export function createContext (): Context
  // ...
}
```

::: details emscripten

then call `Module.emnapiInit` after emscripten runtime initialized.
`Module.emnapiInit` only do initialization once, it will always return the same binding exports after successfully initialized.

```ts
declare namespace Module {
  interface EmnapiInitOptions {
    context: emnapi.Context

    /** node_api_get_module_file_name */
    filename?: string

    /**
     * Support following async_hooks related things
     * on Node.js runtime only
     * 
     * napi_async_init,
     * napi_async_destroy,
     * napi_make_callback,
     * async resource parameter of
     * napi_create_async_work and napi_create_threadsafe_function
     */
    nodeBinding?: typeof import('@tybys/emnapi-node-binding')
  }
  export function emnapiInit (options: EmnapiInitOptions): any
}
```

::: code-group

```html [Browser]
<script src="node_modules/@tybys/emnapi-runtime/dist/emnapi.min.js"></script>
<script src="hello.js"></script>
<script>
var emnapiContext = emnapi.createContext();

Module.onRuntimeInitialized = function () {
  var binding;
  try {
    binding = Module.emnapiInit({ context: emnapiContext });
  } catch (err) {
    console.error(err);
    return;
  }
  var msg = 'hello ' + binding.hello();
  window.alert(msg);
};

// if -sMODULARIZE=1
Module({ /* Emscripten module init options */ }).then(function (Module) {
  var binding = Module.emnapiInit({ context: emnapiContext });
});
</script>
```

```js [Webpack]
import { createContext } from '@tybys/emnapi-runtime'
// emcc -sMODULARIZE=1
import * as init from './hello.js'

const emnapiContext = createContext()

init({ /* Emscripten module init options */ }).then((Module) => {
  const binding = Module.emnapiInit({ context: emnapiContext })
})
```

```js [Node.js]
const emnapi = require('@tybys/emnapi-runtime')
const Module = require('./hello.js')
const emnapiContext = emnapi.createContext()

Module.onRuntimeInitialized = function () {
  let binding
  try {
    binding = Module.emnapiInit({ context: emnapiContext })
  } catch (err) {
    console.error(err)
    return
  }
  const msg = `hello ${binding.hello()}`
  console.log(msg)
}

// if -sMODULARIZE=1
Module({ /* Emscripten module init options */ }).then((Module) => {
  const binding = Module.emnapiInit({ context: emnapiContext })
})
```

:::

::: details wasi-sdk or clang

For non-emscripten, you need to use `@tybys/emnapi-core`. The initialization is similar to emscripten.

::: code-group

```html [Browser]
<script src="node_modules/@tybys/emnapi-runtime/dist/emnapi.min.js"></script>
<script src="node_modules/@tybys/emnapi-core/dist/emnapi-core.min.js"></script>
<script>
const context = emnapi.createContext()
const napiModule = emnapiCore.createNapiModule({ context })

fetch('./hello.wasm').then(res => res.arrayBuffer()).then(wasmBuffer => {
  return WebAssembly.instantiate(wasmBuffer, {
    env: {
      ...napiModule.imports.env,
      // Currently napi-rs imports all symbols from env module
      ...napiModule.imports.napi,
      ...napiModule.imports.emnapi
    },
    // clang
    napi: napiModule.imports.napi,
    emnapi: napiModule.imports.emnapi
  })
}).then(({ instance }) => {
  const binding = napiModule.init(
    instance, // WebAssembly.Instance
    instance.exports.memory, // WebAssembly.Memory
    instance.exports.__indirect_function_table // WebAssembly.Table
  )
  // binding === napiModule.exports
})
</script>
```

```js [Webpack]
import { createNapiModule } from '@tybys/emnapi-core'
import { createContext } from '@tybys/emnapi-runtime'
import base64 from './hello.wasm' // configure load wasm as base64

const context = createContext()
const napiModule = createNapiModule({ context })

fetch('data:application/wasm;base64,' + base64).then(res => res.arrayBuffer()).then(wasmBuffer => {
  return WebAssembly.instantiate(wasmBuffer, {
    env: {
      ...napiModule.imports.env,
      // Currently napi-rs imports all symbols from env module
      ...napiModule.imports.napi,
      ...napiModule.imports.emnapi
    },
    // clang
    napi: napiModule.imports.napi,
    emnapi: napiModule.imports.emnapi
  })
}).then(({ instance }) => {
  const binding = napiModule.init(
    instance,
    instance.exports.memory,
    instance.exports.__indirect_function_table
  )
  // binding === napiModule.exports
})
```

```js [Node.js]
const { createNapiModule } = require('@tybys/emnapi-core')
const { createContext } = require('@tybys/emnapi-runtime')

const context = createContext()
const napiModule = createNapiModule({ context })

WebAssembly.instantiate(wasmBuffer, {
  env: {
    ...napiModule.imports.env,
    // Currently napi-rs imports all symbols from env module
    ...napiModule.imports.napi,
    ...napiModule.imports.emnapi
  },
  // clang
  napi: napiModule.imports.napi,
  emnapi: napiModule.imports.emnapi
}).then(({ instance }) => {
  const binding = napiModule.init(
    instance,
    instance.exports.memory,
    instance.exports.__indirect_function_table
  )
  // binding === napiModule.exports
})
```

```js [Node.js WASI]
const { createNapiModule } = require('@tybys/emnapi-core')
const { createContext } = require('@tybys/emnapi-runtime')
const { WASI } = require('wasi')

const context = createContext()
const napiModule = createNapiModule({ context })

const wasi = new WASI({ /* ... */ })

WebAssembly.instantiate(require('fs').readFileSync('./hello.wasm'), {
  wasi_snapshot_preview1: wasi.wasiImport,
  env: {
    ...napiModule.imports.env,
    // Currently napi-rs imports all symbols from env module
    ...napiModule.imports.napi,
    ...napiModule.imports.emnapi
  },
  // clang
  napi: napiModule.imports.napi,
  emnapi: napiModule.imports.emnapi
}).then(({ instance }) => {
  wasi.initialize(instance)
  const binding = napiModule.init(
    instance,
    instance.exports.memory,
    instance.exports.__indirect_function_table
  )
  // binding === napiModule.exports
})
```

```js [Bundler WASI]
// you can use WASI polyfill in [wasm-util](https://github.com/toyobayashi/wasm-util)
// and [memfs-browser](https://github.com/toyobayashi/memfs-browser)

import { createNapiModule } from '@tybys/emnapi-core'
import { createContext } from '@tybys/emnapi-runtime'
import { WASI } from '@tybys/wasm-util'
import { Volumn, createFsFromVolume } from 'memfs-browser'
import base64 from './hello.wasm' // configure load wasm as base64

const context = createContext()
const napiModule = createNapiModule({ context })

const fs = createFsFromVolume(Volume.from({ /* ... */ }))
const wasi = WASI.createSync({ fs, /* ... */ })

fetch('data:application/wasm;base64,' + base64).then(res => res.arrayBuffer()).then(wasmBuffer => {
  return WebAssembly.instantiate(wasmBuffer, {
    wasi_snapshot_preview1: wasi.wasiImport,
    env: {
      ...napiModule.imports.env,
      // Currently napi-rs imports all symbols from env module
      ...napiModule.imports.napi,
      ...napiModule.imports.emnapi
    },
    // clang
    napi: napiModule.imports.napi,
    emnapi: napiModule.imports.emnapi
  })
}).then(({ instance }) => {
  wasi.initialize(instance)
  const binding = napiModule.init(
    instance,
    instance.exports.memory,
    instance.exports.__indirect_function_table
  )
  // binding === napiModule.exports
})
```

```html [Browser WASI]
<script src="node_modules/@tybys/emnapi-runtime/dist/emnapi.min.js"></script>
<script src="node_modules/@tybys/emnapi-core/dist/emnapi-core.min.js"></script>
<script src="node_modules/@tybys/wasm-util/dist/wasm-util.min.js"></script>
<script src="node_modules/memfs-browser/dist/memfs.min.js"></script>
<script>
const context = createContext()
const napiModule = createNapiModule({ context })

const fs = memfs.createFsFromVolume(Volume.from({ /* ... */ }))
const wasi = wasmUtil.WASI.createSync({ fs, /* ... */ })

fetch('./hello.wasm').then(res => res.arrayBuffer()).then(wasmBuffer => {
  return WebAssembly.instantiate(wasmBuffer, {
    env: {
      ...napiModule.imports.env,
      // Currently napi-rs imports all symbols from env module
      ...napiModule.imports.napi,
      ...napiModule.imports.emnapi
    },
    // clang
    napi: napiModule.imports.napi,
    emnapi: napiModule.imports.emnapi
  })
}).then(({ instance }) => {
  wasi.initialize(instance)
  const binding = napiModule.init(
    instance, // WebAssembly.Instance
    instance.exports.memory, // WebAssembly.Memory
    instance.exports.__indirect_function_table // WebAssembly.Table
  )
  // binding === napiModule.exports
})
</script>
```

:::
