---
sidebarDepth: 3
---

# Experimental V8 API Shim and NAN

The V8 API shim is experimental and incomplete. It provides a compatibility layer for a subset of V8 APIs used by NAN and some direct V8 addons; it is not a full V8 implementation. Check the implemented API surface before porting an addon.

## NAN example

Install NAN in the addon project:

~~~bash
npm install -D nan
~~~

A small synchronous NAN addon can use the shim:

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

The shim also exposes a subset of the direct V8 API:

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

## Select a CMake target

Add emnapi as a CMake subdirectory. Synchronous addons link v8 and emnapi. The application must export the emnapi runtime methods and C entry points used to initialize the addon:

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

Synchronous NAN addons use these targets. NAN's AsyncWorker and progress workers call uv_queue_work, so threaded addons must link v8-mt and emnapi-mt and enable pthreads:

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

The bundled headers set NODE_MODULE_VERSION to 137, so NODE_MODULE_INIT exports node_register_module_v137; the emnapi loader calls that V8 registration entry. For a synchronous WASI build with wasi-sdk 34 or newer, configure with its p1 toolchain:

~~~bash
cmake -S . -B build \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_TOOLCHAIN_FILE="$WASI_SDK_PATH/share/cmake/wasi-sdk-p1.cmake" \
  -DWASI_SDK_PREFIX="$WASI_SDK_PATH"
cmake --build build
~~~

The v8 and v8-mt targets are built for Emscripten and WASI toolchains. The shim is not built for the bare wasm32-unknown-unknown target. For synchronous WASI builds, use the wasi-sdk p1 toolchain on SDK 34 or newer (the regular wasi-sdk toolchain on older releases). For threaded builds, use the version-appropriate pthread toolchain documented in [Using CMake](/v2/guide/using-cmake.html). Emscripten browser builds that use pthreads require cross-origin isolation; see [Multithreaded Asynchronous Operations](/v2/guide/multithreaded-async.html).

## Initialize the addon

For an Emscripten build using MODULARIZE, initialize the generated module and pass an emnapi context:

~~~js
import { createRequire } from 'node:module'
import { createContext } from '@emnapi/runtime'

const require = createRequire(import.meta.url)
const createModule = require('./build/binding.js')
const Module = await createModule()
const binding = Module.emnapiInit({ context: createContext() })
console.log(binding.hello())
~~~

For WASI, instantiate through @emnapi/core and include the V8 plugin:

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

The WASI value is a compatible WASI instance, such as Node.js WASI or a WASI implementation for the browser. Threaded NAN work also needs a worker setup; follow the [WASI worker example](https://github.com/toyobayashi/emnapi/blob/main/packages/example/wasi-module-loader.js) and the threading guide.
