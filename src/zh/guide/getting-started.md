# 开始使用

本节将帮助你使用 emnapi 构建一个 Hello World 示例。

## 环境要求

你需要安装：

* Node.js 最新 LTS (建议 v14.6.0 以上)
* Emscripten 工具链 v2.0.2+ (需要 Python 3)
* CMake v3.9+
* 仅 Windows：GNU make 或 nmake (包含在 Visual Studio C++ 桌面开发工作负载)

设置 `$EMSDK` 环境变量为 emsdk 根目录，并确保 Emscripten 工具链二进制目录（`$EMSDK/upstream/emscripten`）和 CMake 在 `$PATH` 里

未安装 [make](https://github.com/toyobayashi/make-win-build/releases) 的 Windows 用户请使用 [Visual Studio Developer Command Prompt](https://visualstudio.microsoft.com/visual-cpp-build-tools/) 跑命令，因为这里面可以用到 `nmake` 作为替代。

## 安装

创建一个名为 `hello` 的目录，并从 NPM 安装 `emnapi`。

```bash
mkdir ./hello
cd ./hello
npm init -y
npm install -D @tybys/emnapi
```

## 编写源码

创建 `hello.c`。

```c
#include <node_api.h>
#include <string.h>

#define GET_AND_THROW_LAST_ERROR(env)                                    \
  do {                                                                   \
    const napi_extended_error_info *error_info;                          \
    napi_get_last_error_info((env), &error_info);                        \
    bool is_pending;                                                     \
    const char* err_message = error_info->error_message;                 \
    napi_is_exception_pending((env), &is_pending);                       \
    if (!is_pending) {                                                   \
      const char* error_message = err_message != NULL ?                  \
        err_message :                                                    \
        "empty error message";                                           \
      napi_throw_error((env), NULL, error_message);                      \
    }                                                                    \
  } while (0)

#define NAPI_CALL_BASE(env, the_call, ret_val)                           \
  do {                                                                   \
    if ((the_call) != napi_ok) {                                         \
      GET_AND_THROW_LAST_ERROR((env));                                   \
      return ret_val;                                                    \
    }                                                                    \
  } while (0)

#define NAPI_CALL(env, the_call)                                         \
  NAPI_CALL_BASE(env, the_call, NULL)

#define DECLARE_NAPI_PROPERTY(name, func)                                \
  { (name), NULL, (func), NULL, NULL, NULL, napi_default, NULL }

static napi_value Method(napi_env env, napi_callback_info info) {
  napi_value world;
  const char* str = "world";
  size_t str_len = strlen(str);
  NAPI_CALL(env, napi_create_string_utf8(env, str, str_len, &world));
  return world;
}

NAPI_MODULE_INIT() {
  napi_property_descriptor desc = DECLARE_NAPI_PROPERTY("hello", Method);
  NAPI_CALL(env, napi_define_properties(env, exports, 1, &desc));
  return exports;
}
```

## 构建源码

使用 `emcc` 编译 `hello.c`，通过 `-I` 设置包含目录，通过 `--js-library` 链接emnapi JavaScript库。

```bash
emcc -O3 \
     -I./node_modules/@tybys/emnapi/include \
     --js-library=./node_modules/@tybys/emnapi/dist/library_napi.js \
     -sALLOW_MEMORY_GROWTH=1 \
     -o hello.js \
     ./node_modules/@tybys/emnapi/src/emnapi.c \
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
