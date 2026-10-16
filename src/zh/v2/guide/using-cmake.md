# 使用 CMake

需要 CMake 3.13 或更高版本。本例构建带线程支持的 emnapi-mt target。包的 CMake target 会传递 emnapi 头文件和 Emscripten JavaScript 库；应用仍需自行配置 WebAssembly 入口、运行时方法和平台链接选项。

创建 CMakeLists.txt：

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

使用 Emscripten 配置并构建：

~~~bash
emcmake cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
~~~

wasi-sdk 34 及更新版本安装的 pthread toolchain 仍使用旧 target triple。请在项目中创建 cmake/wasi-sdk-pthread-wasip1.cmake：

~~~cmake
include("$ENV{WASI_SDK_PATH}/share/cmake/wasi-sdk-pthread.cmake")
set(CMAKE_C_COMPILER_TARGET wasm32-wasip1-threads)
set(CMAKE_CXX_COMPILER_TARGET wasm32-wasip1-threads)
set(CMAKE_ASM_COMPILER_TARGET wasm32-wasip1-threads)
~~~

使用 wasi-sdk 34 及更新版本配置并构建：

~~~bash
cmake -S . -B build \
  -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_TOOLCHAIN_FILE=cmake/wasi-sdk-pthread-wasip1.cmake \
  -DWASI_SDK_PREFIX="$WASI_SDK_PATH"
cmake --build build
~~~

wasi-sdk 33 及更早版本请改用 $WASI_SDK_PATH/share/cmake/wasi-sdk-pthread.cmake。

此 WASI 配置会为模块创建导入的共享内存。实例化时需要传入匹配的共享 WebAssembly.Memory；[多线程指南](/zh/v2/guide/multithreaded-async.html)包含 loader 参数和 worker 配置示例。

如果直接链接 npm 包内的预编译静态库，请根据 wasi-sdk 版本选择目录：wasi-sdk 33 及更早版本使用 wasm32-wasip1-threads，wasi-sdk 34 及更新版本使用 wasm32-wasip1-threads-wasi-sdk-34。

裸 wasm 请使用包内的 wasm32.cmake toolchain，并将 LLVM_PREFIX 设置为 wasi-sdk 目录。wasm32-unknown-unknown 不构建 V8 API 兼容层。
