### Using node-gyp (Experimental)

目前 node-gyp 仅适用于Linux，并且不支持在交叉编译时链接静态库。已经有 PR 试图让 node-gyp 正常工作。

- https://github.com/nodejs/gyp-next/pull/222
- https://github.com/nodejs/node-gyp/pull/2974

如果你在 Windows 或 macOS 上遇到问题，请查看上面的 PR 了解上游变更细节以及查看 [emnapi-node-gyp-test](https://github.com/toyobayashi/emnapi-node-gyp-test) 了解示例用法。

- 变量

Arch: `node-gyp configure --arch=<wasm32 | wasm64>`

```ts
// node-gyp configure -- -Dvariable_name=value

declare var OS: 'emscripten' | 'wasi' | 'unknown' | ''

/**
 * Enable async work and threadsafe-functions
 * @default 0
 */
declare var wasm_threads: 0 | 1

/** @default 1048576 */
declare var stack_size: number

/** @default 16777216 */
declare var initial_memory: number

/** @default 2147483648 */
declare var max_memory: number

/** @default path.join(path.dirname(commonGypiPath,'./dist/library_napi.js')) */
declare var emnapi_js_library: string

/** @default 0 */
declare var emnapi_manual_linking: 0 | 1
```

- 创建 `binding.gyp`


```py
{
  "targets": [
    {
      "target_name": "hello",
      "sources": [
        "hello.c"
      ],
      "conditions": [
        ["OS == 'emscripten'", {
          "product_extension": "js", # required

          # Windows and Linux
          "cflags": [],
          "cflags_c": [],
          "cflags_cc": [],
          "ldflags": [],

          # macOS uses following config
          'xcode_settings': {
            "WARNING_CFLAGS": [], # cflags
            "OTHER_CFLAGS": [], # cflags_c
            "OTHER_CPLUSPLUSFLAGS": [], # cflags_cc
            "OTHER_LDFLAGS": [] # ldflags
          }
        }],
        ["OS == 'wasi'", {
          # ...
        }],
        ["OS == 'unknown' or OS == ''", {
          # ...
        }]
      ]
    }
  ]
}
```

- 添加以下环境变量

```bash
# Linux or macOS
export GYP_CROSSCOMPILE=1

# emscripten
export AR_target="$EMSDK/upstream/emscripten/emar"
export CC_target="$EMSDK/upstream/emscripten/emcc"
export CXX_target="$EMSDK/upstream/emscripten/em++"

# wasi-sdk
export AR_target="$WASI_SDK_PATH/bin/ar"
export CC_target="$WASI_SDK_PATH/bin/clang"
export CXX_target="$WASI_SDK_PATH/bin/clang++"
```

```bat
@REM Windows

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

- 构建

```bash
# Linux or macOS

# emscripten
emmake node-gyp rebuild \
  --arch=wasm32 \
  --nodedir=./node_modules/emnapi \
  -- -f make-linux -DOS=emscripten # -Dwasm_threads=1

# wasi
node-gyp rebuild \
  --arch=wasm32 \
  --nodedir=./node_modules/emnapi \
  -- -f make-linux -DOS=wasi # -Dwasm_threads=1

# bare wasm32
node-gyp rebuild \
  --arch=wasm32 \
  --nodedir=./node_modules/emnapi \
  -- -f make-linux -DOS=unknown # -Dwasm_threads=1
```

```bat
@REM Use make generator on Windows
@REM Run the bat file in POSIX-like environment (e.g. Cygwin)

@REM emscripten
call npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make-linux -DOS=emscripten
call emmake.bat make -C %~dp0build

@REM wasi
call npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make-linux -DOS=wasi
make -C %~dp0build

@REM bare wasm32
call npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make-linux -DOS=unknown
make -C %~dp0build
```
