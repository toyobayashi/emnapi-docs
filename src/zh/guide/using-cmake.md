# 使用 CMake

环境安装请参考[开始使用][]章节

创建 `CMakeLists.txt`。

```cmake
cmake_minimum_required(VERSION 3.13)

project(emnapiexample)

add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/node_modules/emnapi")

add_executable(hello hello.c)

target_link_libraries(hello emnapi)
if(CMAKE_SYSTEM_NAME STREQUAL "Emscripten")
  target_link_options(hello PRIVATE
    "-sEXPORTED_FUNCTIONS=['_napi_register_wasm_v1','_node_api_module_get_api_version_v1','_malloc','_free']"
  )
elseif(CMAKE_SYSTEM_NAME STREQUAL "WASI")
  set_target_properties(hello PROPERTIES SUFFIX ".wasm")
  target_link_options(hello PRIVATE
    "-mexec-model=reactor"
    "-Wl,--export=napi_register_wasm_v1"
    "-Wl,--export-if-defined=node_api_module_get_api_version_v1"
    "-Wl,--initial-memory=16777216,--export-dynamic,--export=malloc,--export=free,--import-undefined,--export-table"
  )
elseif((CMAKE_C_COMPILER_TARGET STREQUAL "wasm32") OR (CMAKE_C_COMPILER_TARGET STREQUAL "wasm32-unknown-unknown"))
  set_target_properties(hello PROPERTIES SUFFIX ".wasm")
  target_link_options(hello PRIVATE
    "-nostdlib"
    "-Wl,--export=napi_register_wasm_v1"
    "-Wl,--export-if-defined=node_api_module_get_api_version_v1"
    "-Wl,--no-entry"
    "-Wl,--initial-memory=16777216,--export-dynamic,--export=malloc,--export=free,--import-undefined,--export-table"
  )
  target_link_libraries(hello dlmalloc)
  # target_link_libraries(hello emmalloc)
endif()
```

用 `emcmake` 构建，输出 `build/hello.js` 和 `build/hello.wasm`。

可以使用 `-DEMNAPI_FIND_NODE_ADDON_API=ON` 或通过 `include_directories()` 或 `target_include_directories()` 手动将 node-addon-api 目录添加到包含目录。

```bash
mkdir build

# emscripten
emcmake cmake -DCMAKE_BUILD_TYPE=Release \
              -DEMNAPI_FIND_NODE_ADDON_API=ON \
              -G Ninja -H. -Bbuild

# wasi-sdk
cmake -DCMAKE_TOOLCHAIN_FILE=$WASI_SDK_PATH/share/cmake/wasi-sdk.cmake \
      -DWASI_SDK_PREFIX=$WASI_SDK_PATH \
      -DEMNAPI_FIND_NODE_ADDON_API=ON \
      -DCMAKE_BUILD_TYPE=Release \
      -G Ninja -H. -Bbuild

# wasm32
cmake -DCMAKE_TOOLCHAIN_FILE=node_modules/emnapi/cmake/wasm32.cmake \
      -DLLVM_PREFIX=$WASI_SDK_PATH \
      -DCMAKE_BUILD_TYPE=Release \
      -G Ninja -H. -Bbuild

cmake --build build
```

[开始使用]: /zh/guide/getting-started.html
