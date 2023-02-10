Currently you can use [napi-rs](https://github.com/napi-rs/napi-rs) like this, more work is working in progress.  

Note: WASI target require rust nightly toolchain.

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
napi = { version = "2.10.13", default-features = false, features = ["napi8", "compat-mode"] }
napi-sys = { version = "2.2.3", features = ["napi8"] }
napi-derive = "2.10.0"

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
  "-L./node_modules/@tybys/emnapi/lib/wasm32",
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
  "-L./node_modules/@tybys/emnapi/lib/wasm32-wasi",
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

use napi::*;

#[cfg(target_arch = "wasm32")]
use napi::bindgen_prelude::*;
#[cfg(target_arch = "wasm32")]
use napi_sys::*;

#[macro_use]
extern crate napi_derive;

fn sum(a: i32, b: i32) -> i32 {
  a + b
}

#[js_function(2)]
fn sum_js(ctx: CallContext) -> napi::Result<napi::JsNumber> {
  let arg0 = ctx.get::<napi::JsNumber>(0)?.get_int32()?;
  let arg1 = ctx.get::<napi::JsNumber>(1)?.get_int32()?;
  let ret = sum(arg0, arg1);
  ctx.env.create_int32(ret)
}

fn module_register(_env: napi::Env, mut exports: napi::JsObject) -> napi::Result<()> {
  exports.create_named_method("sum", sum_js)?;

  Ok(())
}

#[cfg(not(target_arch = "wasm32"))]
#[module_exports]
fn init(exports: napi::JsObject, env: napi::Env) -> napi::Result<()> {
  module_register(env, exports)
}

#[cfg(target_arch = "wasm32")]
#[no_mangle]
pub unsafe extern "C" fn napi_register_wasm_v1(env: napi_env, exports: napi_value) -> () {
  let env_object = napi::Env::from_raw(env);
  let exports_object = napi::JsObject::from_napi_value(env, exports).unwrap();
  module_register(env_object, exports_object).unwrap();
}
```
