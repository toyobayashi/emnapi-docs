# Using CMake

See [Getting Started] for environment setup.

Create `CMakeLists.txt`.

```cmake
cmake_minimum_required(VERSION 3.13)

project(emnapiexample)

add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/node_modules/emnapi")

add_executable(hello hello.c)

target_link_libraries(hello emnapi)
if(CMAKE_SYSTEM_NAME STREQUAL "Emscripten")
  target_link_options(hello PRIVATE
    "-sEXPORTED_FUNCTIONS=['_malloc','_free']"
  )
elseif(CMAKE_SYSTEM_NAME STREQUAL "WASI")
  target_link_options(hello PRIVATE
    "-mexec-model=reactor"
    "-Wl,--export=napi_register_wasm_v1"
    "-Wl,--initial-memory=16777216,--export-dynamic,--export=malloc,--export=free,--import-undefined,--export-table"
  )
elseif((CMAKE_C_COMPILER_TARGET STREQUAL "wasm32") OR (CMAKE_C_COMPILER_TARGET STREQUAL "wasm32-unknown-unknown"))
  target_link_options(hello PRIVATE
    "-nostdlib"
    "-Wl,--export=napi_register_wasm_v1"
    "-Wl,--no-entry"
    "-Wl,--initial-memory=16777216,--export-dynamic,--export=malloc,--export=free,--import-undefined,--export-table"
  )
  target_link_libraries(hello dlmalloc)
endif()
```

Building with `emcmake`, output `build/hello.js` and `build/hello.wasm`.

```bash
mkdir build

# emscripten
emcmake cmake -DCMAKE_BUILD_TYPE=Release -G Ninja -H. -Bbuild

# wasi-sdk
cmake -DCMAKE_TOOLCHAIN_FILE=$WASI_SDK_PATH/share/cmake/wasi-sdk.cmake \
      -DWASI_SDK_PREFIX=$WASI_SDK_PATH \
      -DCMAKE_BUILD_TYPE=Release \
      -G Ninja -H. -Bbuild

# wasm32
cmake -DCMAKE_TOOLCHAIN_FILE=node_modules/emnapi/cmake/wasm32.cmake \
      -DLLVM_PREFIX=$WASI_SDK_PATH \
      -DCMAKE_BUILD_TYPE=Release \
      -G Ninja -H. -Bbuild

cmake --build build
```

[Getting Started]: /guide/getting-started.html
