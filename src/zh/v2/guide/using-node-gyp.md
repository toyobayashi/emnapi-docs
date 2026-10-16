# 使用 node-gyp

需要 node-gyp `>=10.2.0`。完整示例请参阅 [emnapi-node-gyp-test](https://github.com/toyobayashi/emnapi-node-gyp-test)。

使用 `node-gyp configure --arch=<wasm32 | wasm64>` 选择目标架构。

emnapi 的 node-gyp 构建会定义以下变量：

```ts
declare var OS: 'emscripten' | 'wasi' | 'unknown' | 'wasm' | ''

/** 启用 async work 和线程安全函数。@default 0 */
declare var wasm_threads: 0 | 1

declare var stack_size: number       // @default 1048576
declare var initial_memory: number    // @default 16777216
declare var max_memory: number        // @default 2147483648
declare var emnapi_js_library: string // 默认指向 emnapi/dist/library_napi.js
declare var emnapi_manual_linking: 0 | 1 // @default 0
```

WASI 多线程构建的 initial_memory 和 max_memory 默认分别为 16 MiB 和 2 GiB。传给 instantiateAddon 的共享 WebAssembly.Memory 必须使用相同限制（initial: 256、maximum: 32768 页）。如需 4 GiB 上限，请将 max_memory 设为 4294967296。

创建 `binding.gyp`。Emscripten target 必须将 `product_extension` 设为 `js`。macOS 使用 `xcode_settings` 配置对应的编译器和链接器选项。

```py
{
  "targets": [
    {
      "target_name": "hello",
      "sources": ["hello.c"],
      "conditions": [
        ["OS == 'emscripten'", {
          "product_extension": "js",
          "cflags": [],
          "cflags_c": [],
          "cflags_cc": [],
          "ldflags": [],
          "xcode_settings": {
            "WARNING_CFLAGS": [],
            "OTHER_CFLAGS": [],
            "OTHER_CPLUSPLUSFLAGS": [],
            "OTHER_LDFLAGS": []
          }
        }],
        ["OS == 'wasi'", {
          # wasi-sdk 设置
        }],
        ["OS == 'unknown' or OS == ''", {
          # 裸 wasm 设置
        }]
      ]
    }
  ]
}
```

构建前设置交叉编译器环境变量。在 Linux 和 macOS 上：

```bash
export GYP_CROSSCOMPILE=1

export AR_target="$EMSDK/upstream/emscripten/emar"
export CC_target="$EMSDK/upstream/emscripten/emcc"
export CXX_target="$EMSDK/upstream/emscripten/em++"

export AR_target="$WASI_SDK_PATH/bin/ar"
export CC_target="$WASI_SDK_PATH/bin/clang"
export CXX_target="$WASI_SDK_PATH/bin/clang++"
```

在 Windows 上设置对应路径：

```bat
set GYP_CROSSCOMPILE=1

@REM emscripten
call set AR_target=%%EMSDK:\=/%%/upstream/emscripten/emar.bat
call set CC_target=%%EMSDK:\=/%%/upstream/emscripten/emcc.bat
call set CXX_target=%%EMSDK:\=/%%/upstream/emscripten/em++.bat

@REM wasi-sdk
call set AR_target=%%WASI_SDK_PATH:\=/%%/bin/ar.exe
call set CC_target=%%WASI_SDK_PATH:\=/%%/bin/clang.exe
call set CXX_target=%%WASI_SDK_PATH:\=/%%/bin/clang++.exe
```

在 Linux 或 macOS 上使用 make generator 构建：

```bash
# Emscripten
emmake node-gyp rebuild \
  --arch=wasm32 \
  --nodedir=./node_modules/emnapi \
  -- -f make-emscripten

# wasi-sdk
node-gyp rebuild \
  --arch=wasm32 \
  --nodedir=./node_modules/emnapi \
  -- -f make-wasi

# 裸 wasm32
node-gyp rebuild \
  --arch=wasm32 \
  --nodedir=./node_modules/emnapi \
  -- -f make-wasm
```

在 Windows 上，请在 Cygwin 等 POSIX 风格的环境中使用 make generator：

```bat
@REM Emscripten
call npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make-emscripten
call emmake.bat make -C %~dp0build

@REM wasi-sdk
call npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make-wasi
make -C %~dp0build

@REM 裸 wasm32
call npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make-wasm
make -C %~dp0build
```
