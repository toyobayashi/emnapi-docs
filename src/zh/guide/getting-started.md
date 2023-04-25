# 开始使用

本节将帮助你使用 emnapi 构建一个 Hello World 示例。

## 环境要求

你需要安装：

- Node.js `>= v16.15.0`
- npm `>= v8`
- Emscripten `>= v3.1.9` / wasi-sdk / LLVM clang with wasm support
- (可选) CMake `>= v3.13`
- (可选) ninja
- (可选) make
- (可选) [node-addon-api](https://github.com/nodejs/node-addon-api) `>= 6.1.0`

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
npm install -D emnapi
npm install @emnapi/runtime

# for non-emscripten
npm install @emnapi/core

# if you use node-addon-api
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
emcc -O3 \
     -I./node_modules/emnapi/include \
     -L./node_modules/emnapi/lib/wasm32-emscripten \
     --js-library=./node_modules/emnapi/dist/library_napi.js \
     -sEXPORTED_FUNCTIONS="['_napi_register_wasm_v1','_malloc','_free']" \
     -o hello.js \
     hello.c \
     -lemnapi
```

```bash [wasi-sdk]
clang -O3 \
      -I./node_modules/emnapi/include \
      -L./node_modules/emnapi/lib/wasm32-wasi \
      --target=wasm32-wasi \
      --sysroot=$WASI_SDK_PATH/share/wasi-sysroot \
      -mexec-model=reactor \
      -Wl,--initial-memory=16777216 \
      -Wl,--export-dynamic \
      -Wl,--export=malloc \
      -Wl,--export=free \
      -Wl,--export=napi_register_wasm_v1 \
      -Wl,--import-undefined \
      -Wl,--export-table \
      -o hello.wasm \
      hello.c \
      -lemnapi
```

```bash [clang]
# 你可以选择链接 `libdlmalloc.a` 或者 `libemmalloc.a`
# 以获得 `malloc` 和 `free` 实现

clang -O3 \
      -I./node_modules/emnapi/include \
      -L./node_modules/emnapi/lib/wasm32 \
      --target=wasm32 \
      -nostdlib \
      -Wl,--no-entry \
      -Wl,--initial-memory=16777216 \
      -Wl,--export-dynamic \
      -Wl,--export=malloc \
      -Wl,--export=free \
      -Wl,--export=napi_register_wasm_v1 \
      -Wl,--import-undefined \
      -Wl,--export-table \
      -o hello.wasm \
      hello.c \
      -lemnapi \
      -ldlmalloc # -lemmalloc
```

:::

## 初始化

初始化 emnapi 需要先导入 emnapi 运行时，通过 `createContext` 或 `getDefaultContext` 获得 `Context`，每个 `Context` 都拥有独立的 Node-API 对象，例如 `napi_env`、`napi_value`、`napi_ref`。 如果你有多个 emnapi 模块，你应该在它们之间重用相同的 `Context`。

```ts
declare namespace emnapi {
  // module '@emnapi/runtime'
  export class Context { /* ... */ }
  /** 创建一个新的 context */
  export function createContext (): Context
  /** 懒惰创建 */
  export function getDefaultContext (): Context
  // ...
}
```

::: details emscripten

然后在 emscripten 运行时初始化后调用 `Module.emnapiInit`。 `Module.emnapiInit` 只初始化一次，初始化成功后总是返回相同的绑定导出。

```ts
declare namespace Module {
  interface EmnapiInitOptions {
    context: emnapi.Context

    /** node_api_get_module_file_name */
    filename?: string

    /**
     * 只有在 Node.js 运行时中支持以下
     * 与 async_hooks 相关的 API
     * 
     * napi_async_init,
     * napi_async_destroy,
     * napi_make_callback,
     * napi_create_async_work 和 napi_create_threadsafe_function
     * 的 async resource 参数
     */
    nodeBinding?: typeof import('@emnapi/node-binding')

    /** 查看多线程小节 */
    asyncWorkPoolSize?: number
  }
  export function emnapiInit (options: EmnapiInitOptions): any
}
```

::: code-group

```html [Browser]
<script src="node_modules/@emnapi/runtime/dist/emnapi.min.js"></script>
<script src="hello.js"></script>
<script>
Module.onRuntimeInitialized = function () {
  var binding;
  try {
    binding = Module.emnapiInit({ context: emnapi.getDefaultContext() });
  } catch (err) {
    console.error(err);
    return;
  }
  var msg = 'hello ' + binding.hello();
  window.alert(msg);
};

// if -sMODULARIZE=1
Module({ /* Emscripten module init options */ }).then(function (Module) {
  var binding = Module.emnapiInit({ context: emnapi.getDefaultContext() });
});
</script>
```

```js [Webpack]
import { getDefaultContext } from '@emnapi/runtime'
// emcc -sMODULARIZE=1
import * as init from './hello.js'

init({ /* Emscripten module init options */ }).then((Module) => {
  const binding = Module.emnapiInit({ context: getDefaultContext() })
})
```

```js [Node.js]
const emnapi = require('@emnapi/runtime')
const Module = require('./hello.js')

Module.onRuntimeInitialized = function () {
  let binding
  try {
    binding = Module.emnapiInit({ context: emnapi.getDefaultContext() })
  } catch (err) {
    console.error(err)
    return
  }
  const msg = `hello ${binding.hello()}`
  console.log(msg)
}

// if -sMODULARIZE=1
Module({ /* Emscripten module init options */ }).then((Module) => {
  const binding = Module.emnapiInit({ context: emnapi.getDefaultContext() })
})
```

:::

::: details wasi-sdk or clang

对于非 emscripten，你可以使用 `@emnapi/core`，初始化流程与 emscripten 类似。

::: code-group

```html [Browser]
<script src="node_modules/@emnapi/runtime/dist/emnapi.min.js"></script>
<script src="node_modules/@emnapi/core/dist/emnapi-core.min.js"></script>
<script>
emnapiCore.instantiateNapiModule(fetch('./hello.wasm'), {
  context: emnapi.getDefaultContext(),
  overwriteImports (importObject) {
    // Currently napi-rs imports all symbols from env module
    // importObject.env = {
    //   ...importObject.env,
    //   ...importObject.napi,
    //   ...importObject.emnapi,
    //   // ...
    // }
  }
}).then(({ instance, module, napiModule }) => {
  const binding = napiModule.exports
  // ...
})
</script>
```

```js [Webpack]
import { instantiateNapiModule } from '@emnapi/core'
import { getDefaultContext } from '@emnapi/runtime'
import base64 from './hello.wasm' // configure load wasm as base64

instantiateNapiModule(
  fetch('data:application/wasm;base64,' + base64),
  {
    context: getDefaultContext(),
    overwriteImports (importObject) {
      // importObject.env = {
      //   ...importObject.env,
      //   ...importObject.napi,
      //   ...importObject.emnapi,
      //   // ...
      // }
    }
  }
).then(({ instance, module, napiModule }) => {
  const binding = napiModule.exports
  // ...
})
```

```js [Node.js]
const { instantiateNapiModule } = require('@emnapi/core')
const { getDefaultContext } = require('@emnapi/runtime')
const fs = require('fs')

instantiateNapiModule(fs.promises.readFile('./hello.wasm'), {
  context: getDefaultContext(),
  overwriteImports (importObject) {
    // importObject.env = {
    //   ...importObject.env,
    //   ...importObject.napi,
    //   ...importObject.emnapi,
    //   // ...
    // }
  }
}).then(({ instance, module, napiModule }) => {
  const binding = napiModule.exports
  // ...
})
```

```js [Node.js WASI]
const { instantiateNapiModule } = require('@emnapi/core')
const { getDefaultContext } = require('@emnapi/runtime')
const { WASI } = require('wasi')
const fs = require('fs')

instantiateNapiModule(fs.promises.readFile('./hello.wasm'), {
  wasi: new WASI({ /* ... */ }),
  context: getDefaultContext(),
  overwriteImports (importObject) {
    // importObject.env = {
    //   ...importObject.env,
    //   ...importObject.napi,
    //   ...importObject.emnapi,
    //   // ...
    // }
  }
}).then(({ instance, module, napiModule }) => {
  const binding = napiModule.exports
  // ...
})
```

```js [Bundler WASI]
// 你可以在 [wasm-util](https://github.com/toyobayashi/wasm-util) 找到 WASI 的 polyfill，
// 还有 [memfs-browser](https://github.com/toyobayashi/memfs-browser)

import { instantiateNapiModule } from '@emnapi/core'
import { getDefaultContext } from '@emnapi/runtime'
import { WASI } from '@tybys/wasm-util'
import { Volume, createFsFromVolume } from 'memfs-browser'
import base64 from './hello.wasm' // configure load wasm as base64

const fs = createFsFromVolume(Volume.fromJSON({ /* ... */ }))
instantiateNapiModule(fetch('data:application/wasm;base64,' + base64), {
  wasi: new WASI({ fs, /* ... */ })
  context: getDefaultContext(),
  overwriteImports (importObject) {
    // importObject.env = {
    //   ...importObject.env,
    //   ...importObject.napi,
    //   ...importObject.emnapi,
    //   // ...
    // }
  }
}).then(({ instance, module, napiModule }) => {
  const binding = napiModule.exports
  // ...
})
```

```html [Browser WASI]
<script src="node_modules/@emnapi/runtime/dist/emnapi.min.js"></script>
<script src="node_modules/@emnapi/core/dist/emnapi-core.min.js"></script>
<script src="node_modules/@tybys/wasm-util/dist/wasm-util.min.js"></script>
<script src="node_modules/memfs-browser/dist/memfs.min.js"></script>
<script>
const fs = memfs.createFsFromVolume(memfs.Volume.fromJSON({ /* ... */ }))
emnapiCore.instantiateNapiModule(fetch('./hello.wasm'), {
  wasi: new wasmUtil.WASI({ fs, /* ... */ })
  context: emnapi.getDefaultContext(),
  overwriteImports (importObject) {
    // importObject.env = {
    //   ...importObject.env,
    //   ...importObject.napi,
    //   ...importObject.emnapi,
    //   // ...
    // }
  }
}).then(({ instance, module, napiModule }) => {
  const binding = napiModule.exports
  // ...
})
</script>
```

:::
