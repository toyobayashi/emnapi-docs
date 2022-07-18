# 使用 CMake

你需要安装：

- CMake `>= 3.13`
- make

::: tip
Windows 用户有多种获取 `make` 的选择

- 安装 [mingw-w64](https://www.mingw-w64.org/downloads/)，然后使用 `mingw32-make`
- 下载 [make 的 MSVC 预构建二进制文件](https://github.com/toyobayashi/make-win-build/releases)，添加到 `%Path%` 后重命名为 `mingw32-make`
- 安装 [Visual Studio 2022](https://visualstudio.microsoft.com/) C++ 桌面工作负载，在 `Visual Studio Developer Command Prompt` 中使用 `nmake`
- 安装 [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)，在 `Visual Studio Developer Command Prompt` 中使用 `nmake`
:::

验证环境：

```bash
cmake --version
make -v
# mingw32-make -v
# nmake /?
```

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
emcmake cmake -DCMAKE_BUILD_TYPE=Release -G "MinGW Makefiles" -H. -Bbuild
cmake --build build
```

如果在 Windows 上未安装 `make` 或 `mingw32-make`，请在 `Visual Studio Developer Command Prompt` 中跑下面的构建命令。

```bat
mkdir build
emcmake cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_MAKE_PROGRAM=nmake -G "NMake Makefiles" -H. -Bbuild
cmake --build build
```

完整的示例代码可以在[这里](https://github.com/toyobayashi/emnapi/tree/main/example)找到。

输出的代码可以运行在最近版本的现代浏览器和最新的 Node.js LTS 版本。不支持 IE。

如果在运行时初始化时抛出 JS 错误，Node.js 进程将会退出。可以使用`-sNODEJS_CATCH_EXIT=0` 并自己添加`uncaughtException`。或者可以使用 `Module.onEmnapiInitialized` 来捕获异常。
