目前你可以像这样使用 [napi-rs](https://github.com/napi-rs/napi-rs)，更多支持工作正在进行中。

注意：WASI 构建目标需要使用 rust nightly toolchain。

::: code-group

```toml [Cargo.toml]
[package]
edition = "2021"
name = "binding"
version = "0.0.0"

# We should build binary for WASI reactor
# https://github.com/rust-lang/rust/pull/79997
# https://github.com/WebAssembly/WASI/issues/24
# for wasm
[[bin]]
name = "binding"
path = "src/main.rs"

# for native
# [lib]
# name = "binding"
# path = "src/lib.rs"
# crate-type = ["cdylib"]

[dependencies]
napi = { version = "2.12.1", default-features = false, features = ["napi8"] }
napi-sys = { version = "2.2.3", features = ["napi8"] }
napi-derive = "2.12.2"

[build-dependencies]
napi-build = "2.0.1"

[profile.release]
strip = "symbols"
```

```toml [.cargo/config.toml]
[build]
target = [
  "wasm32-unknown-unknown",
  "wasm32-wasi"
]

[target.wasm32-unknown-unknown]
rustflags = [
  "-L./node_modules/emnapi/lib/wasm32",
  "-lemnapi",
  "-ldlmalloc", # "-lemmalloc",
  "-C", "link-arg=--no-entry",
  "-C", "link-arg=--initial-memory=16777216",
  "-C", "link-arg=--export-dynamic",
  "-C", "link-arg=--export=malloc",
  "-C", "link-arg=--export=free",
  "-C", "link-arg=--export=napi_register_wasm_v1",
  "-C", "link-arg=--export-table",
  "-C", "link-arg=--import-undefined",
]

[target.wasm32-wasi]
rustflags = [
  "-L./node_modules/emnapi/lib/wasm32-wasi",
  "-lemnapi",
  "-C", "link-arg=--initial-memory=16777216",
  "-C", "link-arg=--export-dynamic",
  "-C", "link-arg=--export=malloc",
  "-C", "link-arg=--export=free",
  "-C", "link-arg=--export=napi_register_wasm_v1",
  "-C", "link-arg=--export-table",
  "-C", "link-arg=--import-undefined",
  "-Z", "wasi-exec-model=reactor", # +nightly
]
```

```rust [src/main.rs]
#![no_main]

use napi_derive::napi;

#[napi]
fn fibonacci(n: u32) -> u32 {
  match n {
    1 | 2 => 1,
    _ => fibonacci(n - 1) + fibonacci(n - 2),
  }
}
```

```js [index.js]
const fs = require('fs')
const path = require('path')
const useWASI = false

let wasi
if (useWASI) {
  const { WASI } = require('wasi')
  wasi = new WASI({ /* ... */ })
}

const { instantiateNapiModule } = require('@emnapi/core')

const wasmBuffer = useWASI
  ? fs.readFileSync(path.join(__dirname, './target/wasm32-wasi/release/binding.wasm'))
  : fs.readFileSync(path.join(__dirname, './target/wasm32-unknown-unknown/release/binding.wasm'))

instantiateNapiModule(wasmBuffer, {
  context: require('@emnapi/runtime').getDefaultContext(),
  wasi,
  beforeInit ({ instance }) {
    for (const sym in instance.exports) {
      if (sym.startsWith('__napi_register__')) {
        instance.exports[sym]()
      }
    }
  },
  overwriteImports (importObject) {
    importObject.env = {
      ...importObject.env,
      ...importObject.napi,
      ...importObject.emnapi
    }
  }
}).then(({ napiModule }) => {
  const binding = napiModule.exports
  // output: 5
  console.log(binding.fibonacci(5))
})
```

:::