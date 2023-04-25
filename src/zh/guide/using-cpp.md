# 使用 C++ 和 node-addon-api

需要 [`node-addon-api`](https://github.com/nodejs/node-addon-api) `>= 6.1.0`

```bash
npm install node-addon-api
```

你也可以使用官方的 C++ wrapper [node-addon-api](https://github.com/nodejs/node-addon-api)，它（[v6.0.0](https://github.com/nodejs/node-addon-api/releases/tag/v6.0.0)）已被集成在这个包里，但不可使用 Node.js 环境特定的 API，如 `CallbackScope`。

::: warning

使用 C++ wrapper 编译出的代码只能运行在 Node.js v14.6.0+ 和支持 `FinalizationRegistry` 和 `WeakRef` 的现代浏览器（[v8 引擎 v8.4+](https://v8.dev/blog/v8-release-84))！

:::

创建 `hello.cpp`。

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

使用 `em++` 编译 `hello.cpp`。Emscripten 默认禁用 C++ 异常，所以这里也预定义了 `-DNAPI_DISABLE_CPP_EXCEPTIONS` 和 `-DNODE_ADDON_API_ENABLE_MAYBE`。如果想启用 C++ 异常，请改用 `-sDISABLE_EXCEPTION_CATCHING=0` 并删掉 `.Check()` 调用。请在[这里](https://github.com/nodejs/node-addon-api/blob/main/doc/error_handling.md)查看官方文档。

::: code-group

```bash [emscripten]
em++ -O3 \
     -DNAPI_DISABLE_CPP_EXCEPTIONS \
     -DNODE_ADDON_API_ENABLE_MAYBE \
     -I./node_modules/emnapi/include \
     -I./node_modules/node-addon-api \
     -L./node_modules/emnapi/lib/wasm32-emscripten \
     --js-library=./node_modules/emnapi/dist/library_napi.js \
     -sEXPORTED_FUNCTIONS="['_napi_register_wasm_v1','_malloc','_free']" \
     -o hello.js \
     hello.cpp \
     -lemnapi
```

```bash [wasi-sdk]
clang++ -O3 \
        -DNAPI_DISABLE_CPP_EXCEPTIONS \
        -DNODE_ADDON_API_ENABLE_MAYBE \
        -I./node_modules/emnapi/include \
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
        -Wl,--import-undefined \
        -Wl,--export-table \
        -o hello.wasm \
        hello.cpp \
        -lemnapi
```

```bash [clang]
# `node-addon-api` 使用了 C++ 标准库，所以必须使用 WASI
# 但仍然可以在 `wasm32-unknown-unknown` 使用 C++ 代码编写
# Node-API C 风格的 API

clang++ -O3 \
        -I./node_modules/emnapi/include \
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
