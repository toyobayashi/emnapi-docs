# Getting Started

This section will help you build a Hello World example by using emnapi.

## Environment Requires

You will need to install:

- Node.js `>= v14.6.0`
- Emscripten `>= v3.0.0` (`v2.x` may also works, not tested)

::: tip
Set `$EMSDK` environment variable to the emsdk root path.

Add `$EMSDK/upstream/emscripten` to `$PATH` environment variable.
:::

Verify your environment:

```bash
node -v
npm -v
emcc -v
```

## Installation

There are two methods to install emnapi.

- Install `emnapi` package to local project via `npm` (recommended)
- Build `emnapi` from source via `cmake` and install to custom sysroot path

### NPM

```bash
npm install -D @tybys/emnapi

# optional, see "emnapi Runtime" chapter for more details
# npm install -D @tybys/emnapi-runtime
```

### CMake

You will need to install:

- CMake `>= 3.13`
- make

::: tip
There are several choices to get `make` for Windows user

- Install [mingw-w64](https://www.mingw-w64.org/downloads/), then use `mingw32-make`
- Download [MSVC prebuilt binary of GNU make](https://github.com/toyobayashi/make-win-build/releases), add to `%Path%` then rename it to `mingw32-make`
- Install [Visual Studio 2022](https://visualstudio.microsoft.com/) C++ desktop workload, use `nmake` in `Visual Studio Developer Command Prompt`
- Install [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/), use `nmake` in `Visual Studio Developer Command Prompt`
:::

Verify your environment:

```bash
cmake --version
make -v

# Windows cmd
# mingw32-make -v

# Visual Studio Developer Command Prompt
# nmake /?
```

Clone repository and build from source:

```bash
git clone https://github.com/toyobayashi/emnapi
cd ./emnapi

emcmake cmake -DCMAKE_BUILD_TYPE=Release -H. -Bbuild

# Windows have mingw32-make installed
# emcmake cmake -DCMAKE_BUILD_TYPE=Release -G "MinGW Makefiles" -H. -Bbuild

# Windows Visual Studio Developer Command Prompt
# emcmake cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_MAKE_PROGRAM=nmake -G "NMake Makefiles"  -H. -Bbuild

cmake --build build
cmake --install build [--prefix <sysroot>]
```

Default `sysroot` is `$EMSDK/upstream/emscripten/cache/sysroot`.

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

Create `index.html`, use the output js file. The default export key is `emnapiExports` on [Module](https://emscripten.org/docs/api_reference/module.html) object. You can change the key by predefining `NODE_GYP_MODULE_NAME`. `onEmnapiInitialized` will be called before `onRuntimeInitialized`.

```html
<script src="hello.js"></script>
<script>
// Emscripten js glue code will create a global `Module` object
Module.onEmnapiInitialized = function (err, emnapiExports) {
  if (err) {
    // error handling
    // emnapiExports === undefined
    // Module[NODE_GYP_MODULE_NAME] === undefined
    console.error(err);
  } else {
    // emnapiExports === Module[NODE_GYP_MODULE_NAME]
  }
};

Module.onRuntimeInitialized = function () {
  if (!('emnapiExports' in Module)) return;
  var binding = Module.emnapiExports;
  var msg = 'hello ' + binding.hello();
  window.alert(msg);
};
</script>
```

If you are using `Visual Studio Code` and have `Live Server` extension installed, you can right click the HTML file in Visual Studio Code source tree and click `Open With Live Server`, then you can see the hello world alert!

## Running on Node.js

Create `index.js`.

```js
const Module = require('./hello.js')

Module.onEmnapiInitialized = function (err, emnapiExports) {
  // ...
}

Module.onRuntimeInitialized = function () {
  if (!('emnapiExports' in Module)) return
  const binding = Module.emnapiExports
  const msg = `hello ${binding.hello()}`
  console.log(msg)
}
```

Run the script.

```bash
node ./index.js
```

Then you can see the hello world output.

If a JS error is thrown on runtime initialization, Node.js process will exit. You can use `-sNODEJS_CATCH_EXIT=0` and add `ununcaughtException` handler yourself to avoid this. Alternatively, you can use `Module.onEmnapiInitialized` callback to catch error.
