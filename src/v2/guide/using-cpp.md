# Using C++ and node-addon-api

Install `node-addon-api` `>=6.1.0`:

```bash
npm install node-addon-api
```

The C++ wrapper requires runtime support for FinalizationRegistry and WeakRef. Without these features, node-addon-api cannot be used. See [Getting Started](/v2/guide/getting-started.html) for the v2 toolchain requirements.

Create `binding.cpp`:

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

Emscripten disables C++ exceptions by default. wasi-sdk builds use `-fno-exceptions`; define `NAPI_DISABLE_CPP_EXCEPTIONS` when exceptions are disabled.

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

For wasi-sdk 33 or older, use the `wasm32-wasip1-threads` library directory rather than `wasm32-wasip1-threads-wasi-sdk-34`. Match the directory to the SDK used for linking.

The V8 shim also supports NAN and direct V8 addons through CMake targets `v8` and `v8-mt`; see [the experimental V8/NAN guide](/v2/guide/v8-nan.html).

`node-addon-api` requires the C++ standard library, so use WASI for `node-addon-api`. The bare `wasm32-unknown-unknown` target can be used with C++ source that calls the Node-API C API directly. In that case, provide `operator new` and `operator delete` if the source uses C++ allocation:

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
