# Frequently Asked Questions

## What is the difference between `emnapi` and native Node-API

- Most `emnapi`'s APIs are implemented by JavaScript, while native Node-API is implemented by Node.js C++ code and has full access to V8 engine.

- `emnapi` is compiled to WebAssembly by Emscripten, while native Node-API is compiled to Node.js addon (`.node` is operating system shared library) and can use operating system APIs.

- `emnapi` has no Node.js specific APIs, some of APIs depends the host JavaScript environment. In particular, WebAssembly does not share heap memory with the host, and the API related to ArrayBuffer has certain limitations. see [API List](/reference/list.html)

- Using `emnapi` is able to use the builtin `node-addon-api` out of box if the if the runtime support `FinalizationRegistry` and `WeakRef`.

## When should I use `emnapi`

- You prefer Node-API, and you are more familiar with Node-API than `embind`.
- You want to port your (or existing) Node.js addon written in Node-API to WebAssembly.
- You want your native module npm package to be installed smoothly by users without having to deal with node-gyp.

## How to port existing Node.js addon written in Node-API

::: warning

It is very difficult to port a native addon which has heavy use of operating system APIs (especially heavy use of `Windows.h`).

You **can not** use node-addon-api 
if the runtime does not support `FinalizationRegistry` and `WeakRef`.

:::

1. Checking if all APIs used in the addon are implemented in `emnapi`. See [API List](/reference/list.html).
2. Checking runtime weak reference support by using [emnapi_is_support_weakref](/reference/additional.html#emnapi-is-support-weakref) before calling `napi_create_reference` / `napi_wrap`.
3. Checking if it is necessary to sync wasm memory according to [ArrayBuffer Related API](/reference/list.html#arraybuffer-related)
4. Writing CMakeLists. node-gyp is not supported.
