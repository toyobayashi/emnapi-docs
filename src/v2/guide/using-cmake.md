# Using CMake

Requires CMake 3.13 or newer. This example builds the threaded emnapi-mt target. The package target propagates emnapi headers and the Emscripten JavaScript library; the application still needs its own WebAssembly entry points, runtime methods, and platform linker options.

Create CMakeLists.txt:

~~~cmake
cmake_minimum_required(VERSION 3.13)
project(binding LANGUAGES C CXX)

add_subdirectory("node_modules/emnapi" emnapi)

add_executable(binding binding.c)
target_link_libraries(binding PRIVATE emnapi-mt)

if(CMAKE_SYSTEM_NAME STREQUAL "Emscripten")
  target_compile_options(binding PRIVATE -pthread)
  target_link_options(binding PRIVATE
    -pthread
    "-sWASM_BIGINT=1"
    "-sALLOW_MEMORY_GROWTH=1"
    "-sALLOW_TABLE_GROWTH=1"
    "-sMODULARIZE=1"
    "-sPTHREAD_POOL_SIZE=4"
    "-sPTHREAD_POOL_SIZE_STRICT=2"
    "-sEXPORTED_RUNTIME_METHODS=['emnapiInit','ExitStatus','wasmMemory','growMemory']"
    "-sEXPORTED_FUNCTIONS=['_malloc','_free','_napi_register_wasm_v1','_node_api_module_get_api_version_v1','_emnapi_create_env','_emnapi_delete_env','_uv_library_shutdown']"
  )
elseif(CMAKE_SYSTEM_NAME STREQUAL "WASI")
  set_target_properties(binding PROPERTIES SUFFIX ".wasm")
  target_compile_options(binding PRIVATE -pthread)
  target_link_options(binding PRIVATE
    -pthread
    "-mexec-model=reactor"
    "-Wl,--initial-memory=16777216"
    "-Wl,--max-memory=4294967296"
    "-Wl,--import-memory"
    "-Wl,--shared-memory"
    "-Wl,--export-memory"
    "-Wl,--export-table"
    "-Wl,--growable-table"
    "-Wl,--export=malloc,--export=free"
    "-Wl,--export=napi_register_wasm_v1"
    "-Wl,--export=emnapi_create_env,--export=emnapi_delete_env"
    "-Wl,--export-if-defined=node_api_module_get_api_version_v1"
    "-Wl,--export-if-defined=uv_library_shutdown"
    "-Wl,--export=emnapi_thread_crashed"
    "-Wl,--import-undefined"
  )
endif()
~~~

Configure and build with Emscripten:

~~~bash
emcmake cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
~~~

For wasi-sdk 34 or newer, the installed pthread toolchain still sets the old target triple. Create a project-local wrapper named cmake/wasi-sdk-pthread-wasip1.cmake:

~~~cmake
include("$ENV{WASI_SDK_PATH}/share/cmake/wasi-sdk-pthread.cmake")
set(CMAKE_C_COMPILER_TARGET wasm32-wasip1-threads)
set(CMAKE_CXX_COMPILER_TARGET wasm32-wasip1-threads)
set(CMAKE_ASM_COMPILER_TARGET wasm32-wasip1-threads)
~~~

Configure and build with wasi-sdk 34 or newer:

~~~bash
cmake -S . -B build \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_TOOLCHAIN_FILE=cmake/wasi-sdk-pthread-wasip1.cmake \
  -DWASI_SDK_PREFIX="$WASI_SDK_PATH"
cmake --build build
~~~

For wasi-sdk 33 or older, use $WASI_SDK_PATH/share/cmake/wasi-sdk-pthread.cmake instead.

This WASI configuration creates shared memory imported by the module. Pass a matching shared WebAssembly.Memory when instantiating it; the [multithreading guide](/v2/guide/multithreaded-async.html) shows the loader options and worker setup.

When linking a prebuilt npm archive directly, match the archive directory to wasi-sdk: wasi-sdk 33 or older uses wasm32-wasip1-threads, while wasi-sdk 34 or newer uses wasm32-wasip1-threads-wasi-sdk-34.

For bare wasm, use the package's wasm32.cmake toolchain and set LLVM_PREFIX to the wasi-sdk directory. The V8 API shim is not built for wasm32-unknown-unknown.
