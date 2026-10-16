# 开始使用

本节将帮助你使用 emnapi 构建一个 Hello World 示例。

## 环境要求

你需要安装：

- Node.js `>= v22.12.0`
- npm `>= v8`
- Emscripten `>= v4.1.7`，或 wasi-sdk `>= v26`；裸 `wasm32` 目标需要支持 wasm 的 LLVM clang
- 使用 CMake 构建时需要 CMake `>= v3.13`
- 使用 node-gyp 构建时需要 node-gyp `>= v10.2.0`
- 根据构建系统安装 ninja 或 make
- 可选：[node-addon-api](https://github.com/nodejs/node-addon-api) `>= 6.1.0`

::: tip
设置 `$EMSDK` 环境变量为 emsdk 根目录。

把 `$EMSDK/upstream/emscripten` 添加到 `$PATH` 环境变量中。
:::

::: tip
Windows 用户有多种获取 `make` 的选择

- 安装 [mingw-w64](https://www.mingw-w64.org/downloads/)，然后使用 `mingw32-make`
- 下载 [make 的 MSVC 预构建二进制文件](https://github.com/toyobayashi/make-win-build/releases)，添加到 `%Path%` 后重命名为 `mingw32-make`
- 安装 [Visual Studio 2022](https://visualstudio.microsoft.com/) C++ 桌面工作负载，在 `Visual Studio Developer Command Prompt` 中使用 `nmake`
- 安装 [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)，在 `Visual Studio Developer Command Prompt` 中使用 `nmake`
:::

wasi-sdk 用户请将 `WASI_SDK_PATH` 环境变量设置为 wasi-sdk 安装目录。

验证环境：

```bash
node -v
npm -v
emcc -v

# clang -v
# clang -print-targets # 确保支持 wasm32

cmake --version

# 如果你使用 ninja
ninja --version

# 如果你使用 make
make -v

# 如果你在 Visual Studio Developer Command Prompt 使用 nmake
nmake /?
```

## 安装


```bash
npm install -D emnapi@2.0.0-beta.2 @emnapi/runtime@2.0.0-beta.2

# 用于 WASI 或其他非 Emscripten 实例化方式
npm install @emnapi/core@2.0.0-beta.2

# 如果使用 node-addon-api
npm install node-addon-api
```

::: tip

每个包的版本必须对应一致。

:::

## 编写源码

创建 `hello.c`。

```c
#include <node_api.h>

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
  NAPI_CALL(env, napi_create_string_utf8(env, str, NAPI_AUTO_LENGTH, &world));
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

::: code-group

```bash [emscripten]
emcc -O3 -pthread \
     -DBUILDING_NODE_EXTENSION \
     "-DNAPI_EXTERN=__attribute__((__import_module__(\"env\")))" \
     -I./node_modules/emnapi/include/node \
     -L./node_modules/emnapi/lib/wasm32-emscripten \
     --js-library=./node_modules/emnapi/dist/library_napi.js \
     -sWASM_BIGINT=1 \
     -sALLOW_MEMORY_GROWTH=1 \
     -sALLOW_TABLE_GROWTH=1 \
     -sEXPORTED_FUNCTIONS=$(node -p "JSON.stringify(require('emnapi').requiredConfig.emscripten.settings.EXPORTED_FUNCTIONS)") \
     -sEXPORTED_RUNTIME_METHODS=$(node -p "JSON.stringify(require('emnapi').requiredConfig.emscripten.settings.EXPORTED_RUNTIME_METHODS)") \
     -sEXPORT_ES6=1 \
     -sPTHREAD_POOL_SIZE=4 \
     -o out/hello.js \
     hello.c \
     -lemnapi-mt
```

```bash [wasi-sdk]
"$WASI_SDK_PATH/bin/clang" --target=wasm32-wasip1-threads -O3 \
    -pthread -matomics -mbulk-memory \
    -DBUILDING_NODE_EXTENSION \
    -I./node_modules/emnapi/include/node \
    -L./node_modules/emnapi/lib/wasm32-wasip1-threads-wasi-sdk-34 \
    --sysroot="$WASI_SDK_PATH/share/wasi-sysroot" \
    -mexec-model=reactor \
    -Wl,--initial-memory=16777216 \
    -Wl,--max-memory=4294967296 \
    -Wl,--import-memory -Wl,--shared-memory -Wl,--export-memory \
    -Wl,--export-table -Wl,--growable-table \
    -Wl,--export=malloc,--export=free \
    -Wl,--export=napi_register_wasm_v1 \
    -Wl,--export=emnapi_create_env,--export=emnapi_delete_env \
    -Wl,--export-if-defined=node_api_module_get_api_version_v1 \
    -Wl,--export-if-defined=uv_library_shutdown \
    -Wl,--export=emnapi_thread_crashed \
    -Wl,--import-undefined \
    -o out/hello.wasm \
    hello.c \
    -lemnapi-mt
```

```bash [clang]
# 你可以选择链接 `libdlmalloc.a` 或者 `libemmalloc.a`
# 以获得 `malloc` 和 `free` 实现

clang -O3 \
      -DBUILDING_NODE_EXTENSION \
      -I./node_modules/emnapi/include/node \
      -L./node_modules/emnapi/lib/wasm32 \
      --target=wasm32 \
      -nostdlib \
      -Wl,--no-entry \
      -Wl,--initial-memory=16777216 \
      -Wl,--export-dynamic \
      -Wl,--export=malloc \
      -Wl,--export=free \
      -Wl,--export=napi_register_wasm_v1 \
      -Wl,--export-if-defined=node_api_module_get_api_version_v1 \
      -Wl,--import-undefined \
      -Wl,--export-table \
      -o hello.wasm \
      hello.c \
      -lemnapi \
      -ldlmalloc # -lemmalloc
```

:::

wasi-sdk 33 及更早版本应改用 `wasm32-wasip1-threads` 库目录，而不是 `wasm32-wasip1-threads-wasi-sdk-34`。请确保库目录与用于链接的 wasi-sdk 版本匹配。

## 初始化

emnapi 使用运行时 Context 保存 JavaScript 值和 Node-API 句柄。为需要共享这些句柄的一组模块创建一个 context，并将它传给 emnapi。

::: details Emscripten

上面的 Emscripten 构建会导出 ES 模块工厂函数。工厂函数的 Promise 完成后再调用 Module.emnapiInit；初始化成功后，后续调用会返回相同的 addon 导出。

~~~js
import init from './out/hello.js'
import { createContext } from '@emnapi/runtime'

const Module = await init()
const binding = Module.emnapiInit({ context: createContext() })
console.log(binding.hello())
~~~

此写法可用于 Node.js，也可用于通过 bundler 打包 ESM 导入的浏览器项目。

:::

::: details wasi-sdk 或 clang

对于 bare wasm32 构建，请使用 @emnapi/core 中的 instantiateAddon。它会返回已加载的 WebAssembly 实例和 addonModule；addon 的导出位于 addonModule.exports。

~~~js
import { instantiateAddon } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'

const wasmBytes = await (await fetch('./hello.wasm')).arrayBuffer()
const { addonModule } = await instantiateAddon(wasmBytes, {
  context: createContext()
})
const binding = addonModule.exports
console.log(binding.hello())
~~~

在 Node.js 中加载 WASI 构建时，还要传入 WASI 实例：

~~~js
import { instantiateAddon } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'
import { readFile } from 'node:fs/promises'
import { WASI } from 'node:wasi'

const { addonModule } = await instantiateAddon(
  await readFile('./out/hello.wasm'),
  {
    wasi: new WASI({ version: 'preview1' }),
    context: createContext(),
    overwriteImports(importObject) {
      importObject.env.memory = new WebAssembly.Memory({
        initial: 256,
        maximum: 65536,
        shared: true
      })
    }
  }
)
const binding = addonModule.exports
console.log(binding.hello())
~~~

上文的 WASI pthread 构建在 addon 创建子线程时需要配置 worker。worker 和共享内存配置请参阅[多线程异步操作](/zh/v2/guide/multithreaded-async.html)。浏览器项目需要通过 bundler 加载这些 ESM 包；这些包不提供旧版 classic script 所用的 UMD 全局变量。

对于使用 napi_create_async_work 或 thread-safe function 的普通 wasm32-wasip1 构建，需要传入 WASI 实例并提供 JavaScript 实现：

~~~js
import { instantiateAddon } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'
import asyncWork from '@emnapi/core/plugins/async-work'
import threadSafeFunction from '@emnapi/core/plugins/threadsafe-function'
import { WASI } from 'node:wasi'

const { addonModule } = await instantiateAddon(wasmBytes, {
  wasi: new WASI({ version: 'preview1' }),
  context: createContext(),
  plugins: [asyncWork, threadSafeFunction]
})
~~~

:::
