# 使用 CMake

环境安装请参考[开始使用][]章节

创建 `CMakeLists.txt`。

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

用 `emcmake` 构建，输出 `build/hello.js` 和 `build/hello.wasm`。

```bash
mkdir build
emcmake cmake -DCMAKE_BUILD_TYPE=Release -H. -Bbuild

# Windows
# emcmake cmake -DCMAKE_BUILD_TYPE=Release -G "MinGW Makefiles" -H. -Bbuild

cmake --build build
```

如果在 Windows 上未安装 `make` 或 `mingw32-make`，请在 `Visual Studio Developer Command Prompt` 中跑下面的构建命令。

```bash
mkdir build
emcmake cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_MAKE_PROGRAM=nmake -G "NMake Makefiles" -H. -Bbuild
cmake --build build
```

[开始使用]: /zh/guide/getting-started.html#cmake
