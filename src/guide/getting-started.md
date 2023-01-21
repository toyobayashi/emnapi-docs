# Getting Started

This section will help you build a Hello World example by using emnapi.

## Environment Requires

You will need to install:

- Node.js `>= v16.15.0`
- npm `>= v8`
- Emscripten `>= v3.1.9`
- CMake `>= 3.13`
- ninja / make

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
cmake --version

# if you use ninja
ninja --version

# if you use make
make -v

# if you use nmake in Visual Studio Developer Command Prompt
nmake /?
```

## Installation

There are two methods to install emnapi.

- Install `emnapi` package to local project via `npm` (recommended)
- Build `emnapi` from source via `cmake` and install to custom sysroot path

### Install via NPM

```bash
npm install -D @tybys/emnapi @tybys/emnapi-runtime
```

::: tip

`@tybys/emnapi-runtime` version should match `@tybys/emnapi` version.

:::


### Install via CMake

Clone repository and build from source:

```bash
git clone https://github.com/toyobayashi/emnapi
cd ./emnapi

npm run build             # output ./packages/*/dist
node ./script/release.js  # output ./out
```

Then you can copy the `out` directory to `$EMSDK/upstream/emscripten/cache/sysroot`.

## Writing Source Code

Create `hello.c`

```c
#include <node_api.h>
#include <string.h>

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
  size_t str_len = strlen(str);
  NAPI_CALL(env, napi_create_string_utf8(env, str, str_len, &world));
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

Compile `hello.c` using `emcc`, set include directory by `-I`, export `_malloc` and `_free`, link emnapi JavaScript library by `--js-library`.

```bash
emcc -O3 \
     -I./node_modules/@tybys/emnapi/include \
     --js-library=./node_modules/@tybys/emnapi/dist/library_napi.js \
     -sEXPORTED_FUNCTIONS=['_malloc','_free'] \
     -o hello.js \
     ./node_modules/@tybys/emnapi/src/emnapi.c \
     hello.c
```

If you installed `emnapi` via `cmake --install`, run:

```bash
emcc -O3 \
     -I<sysroot>/include/emnapi \
     -L<sysroot>/lib/emnapi \
     --js-library=<sysroot>/lib/emnapi/library_napi.js \
     -sEXPORTED_FUNCTIONS=['_malloc','_free'] \
     -o hello.js \
     -lemnapi \
     hello.c
```

If you have the environment setting ok, this step will output `hello.js` and `hello.wasm`.

## Running on Browser

Create `index.html`, use the output js file. To initialize emnapi, you need to import the emnapi runtime to create a `Context` by `createContext` first, then call `Module.emnapiInit` after emscripten runtime initialized.

```ts
declare namespace emnapi {
  // module '@tybys/emnapi-runtime'
  export class Context { /* ... */ }
  export function createContext (): Context
  // ...
}

declare namespace Module {
  interface EmnapiInitOptions {
    context: emnapi.Context
    filename?: string
  }
  export function emnapiInit (options: EmnapiInitOptions): any
}
```

Each context owns isolated Node-API object such as `napi_env`, `napi_value`, `napi_ref`. If you have multiple emnapi modules, you should reuse the same `Context` across them. `Module.emnapiInit` only do initialization once, it will always return the same binding exports after successfully initialized.

```html
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

If you are using `Visual Studio Code` and have `Live Server` extension installed, you can right click the HTML file in Visual Studio Code source tree and click `Open With Live Server`, then you can see the hello world alert!

## Running on Node.js

Create `index.js`.

```js
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

Run the script.

```bash
node ./index.js
```

Then you can see the hello world output.
