# Using CMake

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
emcmake cmake -DCMAKE_BUILD_TYPE=Release -G "MinGW Makefiles" -H. -Bbuild
cmake --build build
```

If you have not installed `make` or `mingw32-make` on Windows, execute commands below in `Visual Studio Developer Command Prompt`.

```bat
mkdir build
emcmake cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_MAKE_PROGRAM=nmake -G "NMake Makefiles" -H. -Bbuild
cmake --build build
```

Full example codes can be found [here](https://github.com/toyobayashi/emnapi/tree/main/example).

Output code can run in recent version modern browsers and Node.js latest LTS. IE is not supported.

If a JS error is thrown on runtime initialization, Node.js process will exit. You can use `-sNODEJS_CATCH_EXIT=0` and add `ununcaughtException` handler yourself to avoid this. Alternatively, you can use `Module.onEmnapiInitialized` callback to catch error.
