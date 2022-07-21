# 开始使用

本节将帮助你使用 emnapi 构建一个 Hello World 示例。

## 环境要求

你需要安装：

- Node.js `>= v14.6.0`
- Emscripten `>= v3.0.0` (`v2.x` 未测试，也许可以正常工作)

::: tip
设置 `$EMSDK` 环境变量为 emsdk 根目录。

把 `$EMSDK/upstream/emscripten` 添加到 `$PATH` 环境变量中。
:::

验证环境：

```bash
node -v
npm -v
emcc -v
```

## 安装

安装 emnapi 有两种方法。

- 通过 `npm` 将 `emnapi` 安装到本地项目中（推荐）
- 通过 `cmake` 从源码构建 `emnapi` 然后安装到自定义的 sysroot 路径

### 通过 NPM 安装

```bash
npm install -D @tybys/emnapi

# 可选的，请阅读 "emnapi 运行时" 章节了解更多
# npm install -D @tybys/emnapi-runtime
```

### 通过 CMake 安装

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

# Windows cmd
# mingw32-make -v

# Visual Studio Developer Command Prompt
# nmake /?
```

克隆仓库并从源码构建：

```bash
git clone https://github.com/toyobayashi/emnapi
cd ./emnapi

npm run build

cd ./packages/emnapi

emcmake cmake -DCMAKE_BUILD_TYPE=Release -H. -Bbuild

# Windows have mingw32-make installed
# emcmake cmake -DCMAKE_BUILD_TYPE=Release -G "MinGW Makefiles" -H. -Bbuild

# Windows Visual Studio Developer Command Prompt
# emcmake cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_MAKE_PROGRAM=nmake -G "NMake Makefiles"  -H. -Bbuild

cmake --build build
cmake --install build [--prefix <sysroot>]
```

默认的 `sysroot` 是 `$EMSDK/upstream/emscripten/cache/sysroot`。

## 编写源码

创建 `hello.c`。

```c
#include <node_api.h>
#include <string.h>

#define NAPI_CALL(env, the_call)                                \
  do {                                                          \
    if ((the_call) != napi_ok) {                                \
      const napi_extended_error_info *error_info;               \
      napi_get_last_error_info((env), &error_info);             \
      bool is_pending;                                          \
      const char* err_message = error_info->error_message;      \
      napi_is_exception_pending((env), &is_pending);            \
      if (!is_pending) {                                        \
        const char* error_message = err_message != NULL ?       \
          err_message :                                         \
          "empty error message";                                \
        napi_throw_error((env), NULL, error_message);           \
      }                                                         \
      return NULL;                                              \
    }                                                           \
  } while (0)

static napi_value js_hello(napi_env env, napi_callback_info info) {
  napi_value world;
  const char* str = "world";
  size_t str_len = strlen(str);
  NAPI_CALL(env, napi_create_string_utf8(env, str, str_len, &world));
  return world;
}

NAPI_MODULE_INIT() {
  napi_value hello;
  NAPI_CALL(env, napi_create_function(env, "hello", NAPI_AUTO_LENGTH,
                                      js_hello, NULL, &hello));
  NAPI_CALL(env, napi_set_named_property(env, exports, "hello", hello));
  return exports;
}
```

C 代码等价于下面的 JavaScript：

```js
module.exports = (function (exports) {
  const hello = function hello () {
    // js_hello 中的原生代码
    const world = 'world'
    return world
  }

  exports.hello = hello
  return exports
})(module.exports)
```

## 构建源码

使用 `emcc` 编译 `hello.c`，通过 `-I` 设置包含目录，导出 `_malloc` 和 `_free`，通过 `--js-library` 链接emnapi JavaScript库。

```bash
emcc -O3 \
     -I./node_modules/@tybys/emnapi/include \
     --js-library=./node_modules/@tybys/emnapi/dist/library_napi.js \
     -sEXPORTED_FUNCTIONS=['_malloc','_free'] \
     -o hello.js \
     ./node_modules/@tybys/emnapi/src/emnapi.c \
     hello.c
```

如果你通过 `cmake --install` 安装 `emnapi`，请运行：

```bash
emcc -O3 \
     -I<sysroot>/include/emnapi \
     -L<sysroot>/lib/emnapi \
     --js-library=<sysroot>/lib/emnapi/library_napi.js \
     -sEXPORTED_FUNCTIONS=['_malloc','_free'] \
     -o hello.js \
     -lemnapi \
     hello.c
```

如果上面的环境准备没有问题，这一步将会输出 `hello.js` 和 `hello.wasm`。

## 在浏览器上运行

把输出的 JS 引入进 HTML 使用，默认导出在 [Module](https://emscripten.org/docs/api_reference/module.html) 对象上的 `emnapiExports`。可通过预定义 `NODE_GYP_MODULE_NAME` 修改默认的导出键值。`onEmnapiInitialized` 将在 `onRuntimeInitialized` 之前被调用。

```html
<script src="hello.js"></script>
<script>
// Emscripten js glue code will create a global `Module` object
Module.onEmnapiInitialized = function (err, emnapiExports) {
  if (err) {
    // error handling
    // emnapiExports === undefined
    // Module[NODE_GYP_MODULE_NAME] === undefined
    console.error(err);
  } else {
    // emnapiExports === Module[NODE_GYP_MODULE_NAME]
  }
};

Module.onRuntimeInitialized = function () {
  if (!('emnapiExports' in Module)) return;
  var binding = Module.emnapiExports;
  var msg = 'hello ' + binding.hello();
  window.alert(msg);
};
</script>
```

如果你正在使用 `Visual Studio Code` 并安装了 `Live Server` 扩展，则可以右键单击 Visual Studio Code 源代码树中的 HTML 文件再单击 `Open With Live Server`，然后你就可以看到 hello world 弹窗了！

## 在 Node.js 上运行

创建 `index.js`。

```js
const Module = require('./hello.js')

Module.onEmnapiInitialized = function (err, emnapiExports) {
  // ...
}

Module.onRuntimeInitialized = function () {
  if (!('emnapiExports' in Module)) return
  const binding = Module.emnapiExports
  const msg = `hello ${binding.hello()}`
  console.log(msg)
}
```

执行脚本。

```bash
node ./index.js
```

然后你就可以看到 hello world 的输出了。

如果在运行时初始化时抛出 JS 错误，Node.js 进程将会退出。可以使用`-sNODEJS_CATCH_EXIT=0` 并自己添加`uncaughtException`。或者可以使用 `Module.onEmnapiInitialized` 来捕获异常。
