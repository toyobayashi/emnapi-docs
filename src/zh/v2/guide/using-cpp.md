# 使用 C++ 和 node-addon-api

安装 `node-addon-api` `>=6.1.0`：

```bash
npm install node-addon-api
```

C++ wrapper 需要运行时支持 FinalizationRegistry 和 WeakRef。不支持这些功能时，不能使用 node-addon-api。v2 工具链要求见[开始使用](/zh/v2/guide/getting-started.html)。

创建 `binding.cpp`：

```cpp
#include <napi.h>

Napi::String JsHello(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "world");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("hello", Napi::Function::New(env, JsHello));
  return exports;
}

NODE_API_MODULE(binding, Init)
```

Emscripten 默认禁用 C++ 异常。使用 wasi-sdk 构建时要添加 `-fno-exceptions`；禁用异常时请定义 `NAPI_DISABLE_CPP_EXCEPTIONS`。

::: code-group

```bash [emscripten]
em++ -O3 -pthread \
    -DBUILDING_NODE_EXTENSION \
    -DNAPI_DISABLE_CPP_EXCEPTIONS \
    "-DNAPI_EXTERN=__attribute__((__import_module__(\"env\")))" \
    -I./node_modules/emnapi/include/node \
    -I$(node -p "require('node-addon-api').include_dir") \
    -L./node_modules/emnapi/lib/wasm32-emscripten \
    --js-library=./node_modules/emnapi/dist/library_napi.js \
    -sWASM_BIGINT=1 \
    -sALLOW_MEMORY_GROWTH=1 \
    -sALLOW_TABLE_GROWTH=1 \
    -sEXPORTED_FUNCTIONS=$(node -p "JSON.stringify(require('emnapi').requiredConfig.emscripten.settings.EXPORTED_FUNCTIONS)") \
    -sEXPORTED_RUNTIME_METHODS=$(node -p "JSON.stringify(require('emnapi').requiredConfig.emscripten.settings.EXPORTED_RUNTIME_METHODS)") \
    -sEXPORT_ES6=1 \
    -sPTHREAD_POOL_SIZE=4 \
    -o out/binding-naa.js \
    binding.cpp \
    -lemnapi-mt
```

```bash [wasi-sdk]
"$WASI_SDK_PATH/bin/clang++" --target=wasm32-wasip1-threads -O3 \
    -pthread -matomics -mbulk-memory -fno-exceptions \
    -DBUILDING_NODE_EXTENSION \
    -DNAPI_DISABLE_CPP_EXCEPTIONS \
    -I./node_modules/emnapi/include/node \
    -I$(node -p "require('node-addon-api').include_dir") \
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
    -o out/binding-naa.wasm \
    binding.cpp \
    -lemnapi-mt
```

:::

wasi-sdk 33 及更早版本应使用 `wasm32-wasip1-threads` 库目录，而不是 `wasm32-wasip1-threads-wasi-sdk-34`。库目录应与用于链接的 wasi-sdk 版本匹配。

V8 兼容层还支持通过 CMake target `v8` 和 `v8-mt` 使用 NAN 或直接使用 V8 API；参阅[实验性 V8/NAN 指南](/zh/v2/guide/v8-nan.html)。

`node-addon-api` 需要 C++ 标准库，因此应使用 WASI。裸 `wasm32-unknown-unknown` 目标可以使用 C++ 编写直接调用 Node-API C API 的源码。如果源码使用 C++ 动态分配，请提供 `operator new` 和 `operator delete`：

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
