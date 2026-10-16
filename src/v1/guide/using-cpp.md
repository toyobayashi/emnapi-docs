# Using C++ and node-addon-api

Require [`node-addon-api`](https://github.com/nodejs/node-addon-api) `>= 6.1.0`

```bash
npm install node-addon-api
```

::: warning

C++ wrapper can only be used to target Node.js v14.6.0+ and modern browsers those support `FinalizationRegistry` and `WeakRef` ([v8 engine v8.4+](https://v8.dev/blog/v8-release-84))!

:::

Create `hello.cpp`.

```cpp
#include <napi.h>

Napi::String JsHello(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "world");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "hello"),
              Napi::Function::New(env, JsHello, "hello")).Check();
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
```

Compile `hello.cpp` using `em++`. C++ exception is disabled by Emscripten default, and not supported by wasi-sdk, so predefine `-DNAPI_DISABLE_CPP_EXCEPTIONS` and `-DNODE_ADDON_API_ENABLE_MAYBE` here. If you would like to enable C++ exception, use `-sDISABLE_EXCEPTION_CATCHING=0` instead and remove `.Check()` call. See official documentation [here](https://github.com/nodejs/node-addon-api/blob/main/doc/error_handling.md).

::: code-group

```bash [emscripten]
em++ -O3 \
     -DBUILDING_NODE_EXTENSION \
     -DNAPI_DISABLE_CPP_EXCEPTIONS \
     -DNODE_ADDON_API_ENABLE_MAYBE \
     "-DNAPI_EXTERN=__attribute__((__import_module__(\"env\")))" \
     -I./node_modules/emnapi/include/node \
     -I./node_modules/node-addon-api \
     -L./node_modules/emnapi/lib/wasm32-emscripten \
     --js-library=./node_modules/emnapi/dist/library_napi.js \
     -sEXPORTED_FUNCTIONS="['_napi_register_wasm_v1','_node_api_module_get_api_version_v1','_malloc','_free']" \
     -o hello.js \
     hello.cpp \
     -lemnapi
```

```bash [wasi-sdk]
clang++ -O3 \
        -DBUILDING_NODE_EXTENSION \
        -DNAPI_DISABLE_CPP_EXCEPTIONS \
        -DNODE_ADDON_API_ENABLE_MAYBE \
        -I./node_modules/emnapi/include/node \
        -I./node_modules/node-addon-api \
        -L./node_modules/emnapi/lib/wasm32-wasi \
        --target=wasm32-wasi \
        --sysroot=$WASI_SDK_PATH/share/wasi-sysroot \
        -fno-exceptions \
        -mexec-model=reactor \
        -Wl,--initial-memory=16777216 \
        -Wl,--export-dynamic \
        -Wl,--export=malloc \
        -Wl,--export=free \
        -Wl,--export=napi_register_wasm_v1 \
        -Wl,--export-if-defined=node_api_module_get_api_version_v1 \
        -Wl,--import-undefined \
        -Wl,--export-table \
        -o hello.wasm \
        hello.cpp \
        -lemnapi
```

```bash [clang]
# `node-addon-api` is using the C++ standard libraries,
# so you must use WASI if you are using `node-addon-api`.
# You can still use `wasm32-unknown-unknown` target
# if you use Node-API C API only in C++.

clang++ -O3 \
        -DBUILDING_NODE_EXTENSION \
        -I./node_modules/emnapi/include/node \
        -L./node_modules/emnapi/lib/wasm32 \
        --target=wasm32 \
        -fno-exceptions \
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
        -o node_api_c_api_only.wasm \
        node_api_c_api_only.cpp \
        -lemnapi \
        -ldlmalloc # -lemmalloc
```

:::

You should provide `operator new` and `operator delete` definition when targeting `wasm32-unknown-unknown`

```cpp
#include <stddef.h>

extern "C" void* malloc(size_t size);
extern "C" void free(void* p);

void* operator new(size_t size) {
  return malloc(size);
}

void operator delete(void* p) noexcept {
  free(p);
}
```
