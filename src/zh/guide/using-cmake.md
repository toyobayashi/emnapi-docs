# 使用 CMake

创建 `CMakeLists.txt`。

```cmake
cmake_minimum_required(VERSION 3.9)

project(emnapiexample)

add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/node_modules/@tybys/emnapi")

add_executable(hello hello.c)
# or add_executable(hello hello.cpp)

target_link_libraries(hello emnapi)
target_link_options(hello PRIVATE
  "-sALLOW_MEMORY_GROWTH=1"
  "-sNODEJS_CATCH_EXIT=0"
)
```

用 `emcmake` 构建，输出 `build/hello.js` 和 `build/hello.wasm`。

```bash
mkdir build
emcmake cmake -DCMAKE_BUILD_TYPE=Release -H. -Bbuild
cmake --build build
```

如果在 Windows 上未安装 `make`，请在 `Visual Studio Developer Command Prompt` 中跑下面的构建命令。

```bat
mkdir build
emcmake cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_MAKE_PROGRAM=nmake -G "NMake Makefiles" -H. -Bbuild
cmake --build build
```

完整的示例代码可以在[这里](https://github.com/toyobayashi/emnapi/tree/main/example)找到。

输出的代码可以运行在最近版本的现代浏览器和最新的 Node.js LTS 版本。不支持 IE。

如果在运行时初始化时抛出 JS 错误，Node.js 进程将会退出。可以使用`-sNODEJS_CATCH_EXIT=0` 并自己添加`uncaughtException`。或者可以使用 `Module.onEmnapiInitialized` 来捕获异常。
