---
sidebarDepth: 3
---

# 实验性 V8 API 兼容层与 NAN

V8 API 兼容层仍处于实验阶段，尚未完整实现。它为 NAN 和部分直接使用 V8 API 的 addon 提供了一个子集兼容层，并不是完整的 V8 实现。移植 addon 前，请先核对当前已实现的 API。

## NAN 示例

在 addon 项目中安装 NAN：

~~~bash
npm install -D nan
~~~

简单的同步 NAN addon 可以使用此兼容层：

~~~cpp
#include <nan.h>

NAN_METHOD(Hello) {
  info.GetReturnValue().Set(Nan::New("world").ToLocalChecked());
}

NAN_MODULE_INIT(Init) {
  Nan::SetMethod(target, "hello", Hello);
}

NODE_MODULE(binding, Init)
~~~

兼容层也提供了一部分直接使用的 V8 API：

~~~cpp
#include <node.h>
#include <v8.h>

void Hello(const v8::FunctionCallbackInfo<v8::Value>& info) {
  info.GetReturnValue().Set(
      v8::String::NewFromUtf8(info.GetIsolate(), "world").ToLocalChecked());
}

NODE_MODULE_INIT() {
  NODE_SET_METHOD(exports, "hello", Hello);
}
~~~

## 选择 CMake target

将 emnapi 作为 CMake 子目录加入。同步 addon 链接 v8 和 emnapi。应用还要导出初始化 addon 所需的 emnapi 运行时方法和 C 入口：

~~~cmake
cmake_minimum_required(VERSION 3.13)
project(binding LANGUAGES C CXX)

add_subdirectory("node_modules/emnapi" emnapi)
add_executable(binding binding.cpp)
target_include_directories(binding PRIVATE "node_modules/nan")
target_link_libraries(binding PRIVATE v8 emnapi)

if(CMAKE_SYSTEM_NAME STREQUAL "Emscripten")
  target_link_options(binding PRIVATE
    "-sWASM_BIGINT=1"
    "-sALLOW_MEMORY_GROWTH=1"
    "-sALLOW_TABLE_GROWTH=1"
    "-sMODULARIZE=1"
    "-sEXPORTED_RUNTIME_METHODS=['emnapiInit','ExitStatus','wasmMemory','growMemory']"
    "-sEXPORTED_FUNCTIONS=['_malloc','_free','_emnapi_create_env','_emnapi_delete_env','_node_register_module_v137']"
  )
elseif(CMAKE_SYSTEM_NAME STREQUAL "WASI")
  set_target_properties(binding PROPERTIES SUFFIX ".wasm")
  target_link_options(binding PRIVATE
    "-mexec-model=reactor"
    "-Wl,--export-memory"
    "-Wl,--export-table"
    "-Wl,--export=malloc,--export=free"
    "-Wl,--export=node_register_module_v137"
    "-Wl,--export=emnapi_create_env,--export=emnapi_delete_env"
    "-Wl,--import-undefined"
  )
endif()
~~~

同步 NAN addon 使用这些 target。NAN 的 AsyncWorker 和 progress worker 会调用 uv_queue_work，因此多线程 addon 必须链接 v8-mt 和 emnapi-mt，并启用 pthread：

~~~cmake
target_link_libraries(binding PRIVATE v8-mt emnapi-mt)
target_compile_options(binding PRIVATE -pthread)
target_link_options(binding PRIVATE -pthread)

if(CMAKE_SYSTEM_NAME STREQUAL "Emscripten")
  target_link_options(binding PRIVATE
    "-sPTHREAD_POOL_SIZE=4"
    "-sPTHREAD_POOL_SIZE_STRICT=2"
  )
elseif(CMAKE_SYSTEM_NAME STREQUAL "WASI")
  target_link_options(binding PRIVATE
    "-mexec-model=reactor"
    "-Wl,--initial-memory=16777216"
    "-Wl,--max-memory=4294967296"
    "-Wl,--import-memory"
    "-Wl,--shared-memory"
    "-Wl,--export-memory"
    "-Wl,--export-table"
    "-Wl,--growable-table"
    "-Wl,--export=malloc,--export=free"
    "-Wl,--export=node_register_module_v137"
    "-Wl,--export=emnapi_create_env,--export=emnapi_delete_env"
    "-Wl,--export-if-defined=uv_library_shutdown"
    "-Wl,--export=emnapi_thread_crashed"
    "-Wl,--import-undefined"
  )
endif()
~~~

附带头文件将 NODE_MODULE_VERSION 设为 137，因此 NODE_MODULE_INIT 导出 node_register_module_v137；emnapi loader 会调用该 V8 注册入口。wasi-sdk 34 及更新版本的同步 WASI 构建可使用 p1 toolchain 配置：

~~~bash
cmake -S . -B build \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_TOOLCHAIN_FILE="$WASI_SDK_PATH/share/cmake/wasi-sdk-p1.cmake" \
  -DWASI_SDK_PREFIX="$WASI_SDK_PATH"
cmake --build build
~~~

v8 和 v8-mt target 支持 Emscripten 和 WASI 工具链。裸 wasm32-unknown-unknown 目标不构建兼容层。同步 WASI 构建在 SDK 34 及更新版本中使用 wasi-sdk p1 toolchain（更早版本使用常规 wasi-sdk toolchain）。多线程构建请使用[使用 CMake](/zh/v2/guide/using-cmake.html)中按版本说明的 pthread toolchain。Emscripten 浏览器 pthread 构建需要跨源隔离；请参阅[多线程异步操作](/zh/v2/guide/multithreaded-async.html)。

## 初始化 addon

对于启用了 MODULARIZE 的 Emscripten 构建，初始化生成的模块并传入 emnapi context：

~~~js
import { createRequire } from 'node:module'
import { createContext } from '@emnapi/runtime'

const require = createRequire(import.meta.url)
const createModule = require('./build/binding.js')
const Module = await createModule()
const binding = Module.emnapiInit({ context: createContext() })
console.log(binding.hello())
~~~

对于 WASI，通过 @emnapi/core 实例化，并加入 V8 插件：

~~~js
import { instantiateAddon } from '@emnapi/core'
import v8 from '@emnapi/core/plugins/v8'
import { createContext } from '@emnapi/runtime'
import { WASI } from 'node:wasi'

const wasi = new WASI({ version: 'preview1' })
const { addonModule } = await instantiateAddon(wasmBytes, {
  context: createContext(),
  wasi,
  plugins: [v8]
})
const binding = addonModule.exports
~~~

wasi 变量需要是兼容的 WASI 实例，例如 Node.js 内置 WASI，或浏览器使用的 WASI 实现。多线程 NAN work 还需要配置 worker；请参阅 [WASI worker 示例](https://github.com/toyobayashi/emnapi/blob/main/packages/example/wasi-module-loader.js)和多线程指南。
