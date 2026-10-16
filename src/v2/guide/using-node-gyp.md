# Using node-gyp

Require node-gyp `>=10.2.0`. See [emnapi-node-gyp-test](https://github.com/toyobayashi/emnapi-node-gyp-test) for complete examples.

Select a target architecture with `node-gyp configure --arch=<wasm32 | wasm64>`.

The emnapi node-gyp build defines these variables:

```ts
declare var OS: 'emscripten' | 'wasi' | 'unknown' | 'wasm' | ''

/** Enable async work and thread-safe functions. @default 0 */
declare var wasm_threads: 0 | 1

declare var stack_size: number       // @default 1048576
declare var initial_memory: number    // @default 16777216
declare var max_memory: number        // @default 2147483648
declare var emnapi_js_library: string // defaults to emnapi/dist/library_napi.js
declare var emnapi_manual_linking: 0 | 1 // @default 0
```

For WASI thread builds, the default initial_memory and max_memory values are 16 MiB and 2 GiB. The shared WebAssembly.Memory passed to instantiateAddon must use the same limits (initial: 256, maximum: 32768 pages). Set max_memory to 4294967296 if you want a 4 GiB maximum.

Create a `binding.gyp`. The Emscripten target must set `product_extension` to `js`. macOS uses the `xcode_settings` equivalents for compiler and linker flags.

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
          # wasi-sdk settings
        }],
        ["OS == 'unknown' or OS == ''", {
          # bare wasm settings
        }]
      ]
    }
  ]
}
```

Set the cross-compiler environment variables before building. On Linux and macOS:

```bash
export GYP_CROSSCOMPILE=1

export AR_target="$EMSDK/upstream/emscripten/emar"
export CC_target="$EMSDK/upstream/emscripten/emcc"
export CXX_target="$EMSDK/upstream/emscripten/em++"

export AR_target="$WASI_SDK_PATH/bin/ar"
export CC_target="$WASI_SDK_PATH/bin/clang"
export CXX_target="$WASI_SDK_PATH/bin/clang++"
```

On Windows, set the equivalent paths:

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



Build on Linux or macOS with the make generator:

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

# bare wasm32
node-gyp rebuild \
  --arch=wasm32 \
  --nodedir=./node_modules/emnapi \
  -- -f make-wasm
```

On Windows, run the make generator from a POSIX-like environment such as Cygwin:

```bat
@REM Emscripten
call npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make-emscripten
call emmake.bat make -C %~dp0build

@REM wasi-sdk
call npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make-wasi
make -C %~dp0build

@REM bare wasm32
call npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make-wasm
make -C %~dp0build
```
