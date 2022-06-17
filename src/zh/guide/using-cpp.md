# 使用 C++ 包装器

你也可以使用官方的 C++ wrapper [node-addon-api](https://github.com/nodejs/node-addon-api)，它（v5.0.0）已被集成在这个包里，但不可使用 Node.js 环境特定的 API，如 `AsyncContext`, `Function::MakeCallback` 等等。

::: warning

使用 C++ wrapper 编译出的代码只能运行在 Node.js v14.6.0+ 和支持 `FinalizationRegistry` 和 `WeakRef` 的现代浏览器（[v8 引擎 v8.4+](https://v8.dev/blog/v8-release-84))！

:::

Create `hello.cpp`.

```cpp
#include <napi.h>

Napi::String Method(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "world");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "hello"),
              Napi::Function::New(env, Method)).Check();
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
```

使用 `em++` 编译 `hello.cpp`。Emscripten 默认禁用 C++ 异常，所以这里也预定义了 `-DNAPI_DISABLE_CPP_EXCEPTIONS` 和 `-DNODE_ADDON_API_ENABLE_MAYBE`。如果想启用 C++ 异常，请改用 `-sDISABLE_EXCEPTION_CATCHING=0` 并删掉 `.Check()` 调用。

```bash
em++ -O3 \
     -DNAPI_DISABLE_CPP_EXCEPTIONS \
     -DNODE_ADDON_API_ENABLE_MAYBE \
     -I./node_modules/@tybys/emnapi/include \
     --js-library=./node_modules/@tybys/emnapi/dist/library_napi.js \
     -sALLOW_MEMORY_GROWTH=1 \
     -o hello.js \
     ./node_modules/@tybys/emnapi/src/emnapi.c \
     hello.cpp
```
