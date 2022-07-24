# Frequently Asked Questions

## What is the difference between `emnapi` and native Node-API

- Most `emnapi`'s APIs are implemented by JavaScript, while native Node-API is implemented by Node.js C++ code and has full access to V8 engine.

- `emnapi` is compiled to WebAssembly by Emscripten, while native Node-API is compiled to Node.js addon (`.node` is operating system shared library) and can use operating system APIs.

- `emnapi` has no Node.js specific APIs, some of APIs depends the host JavaScript environment, see [API List](/reference/list.html)

- Using `emnapi` is able to use the builtin `node-addon-api` out of box if the if the runtime support `FinalizationRegistry` and `WeakRef`.

## When should I use `emnapi`

- You want to run the same C/C++ code on both Node.js and browser.
- You prefer Node-API, and you are more familiar with Node-API than `embind`.
- You want to port existing Node.js addon written in Node-API to WebAssembly.

## When should I not use `emnapi`

- High performance requirements, worry about the call overhead.

## How to port existing Node.js addon written in Node-API

::: warning

It is very difficult to port a native addon which has heavy use of operating system APIs (especially heavy use of `Windows.h`).

You **can not** use node-addon-api 
if the runtime does not support `FinalizationRegistry` and `WeakRef`.

:::

1. Checking if all APIs used in the addon are implemented in `emnapi`. See [API List](/reference/list.html).
2. Checking runtime weak reference support by using [emnapi_is_support_weakref](/reference/additional.html#emnapi-is-support-weakref) before calling `napi_create_reference` / `napi_wrap`.
3. Writing CMakeLists. node-gyp is not supported.
