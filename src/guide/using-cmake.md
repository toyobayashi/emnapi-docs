# Using CMake

See [Getting Started] for environment setup.

Create `CMakeLists.txt`.

```cmake
cmake_minimum_required(VERSION 3.13)

project(emnapiexample)

add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/node_modules/@tybys/emnapi")

add_executable(hello hello.c)
# or add_executable(hello hello.cpp)

target_link_libraries(hello emnapi_full)
target_link_options(hello PRIVATE
  "-sEXPORTED_FUNCTIONS=['_malloc','_free']"
)
```

Building with `emcmake`, output `build/hello.js` and `build/hello.wasm`.

```bash
mkdir build

emcmake cmake -DCMAKE_BUILD_TYPE=Release -G Ninja -H. -Bbuild
# emcmake cmake -DCMAKE_BUILD_TYPE=Release -G "Unix Makefiles" -H. -Bbuild
# emcmake cmake -DCMAKE_BUILD_TYPE=Release -G "MinGW Makefiles" -H. -Bbuild
# emcmake cmake -DCMAKE_BUILD_TYPE=Release -G "NMake Makefiles" -H. -Bbuild

cmake --build build
```

[Getting Started]: /guide/getting-started.html
