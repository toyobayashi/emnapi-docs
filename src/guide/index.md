---
sidebarDepth: 2
---

# What is emnapi

<img :src="'/emnapi.svg'" alt="emnapi logo" width="256" />

`emnapi` is a subset of [**N**ode-**API**](https://nodejs.org/docs/v16.15.0/api/n-api.html) (named NAPI previously) implementation for **Em**scripten.

## Motivation

I built this library for aiming to be able to build Node-API code to Emscripten WebAssembly without changing your C/C++ code as far as possible.

## Why not `embind`

`embind` is pretty good if you don't need to running same Node-API binding code on both browser and Node.js. Compiling to wasm by using `embind` can also make your code running on both browser and Node.js, but when targeting Node.js, we prefer compiling to Node.js native addon instead of wasm for native performance. So in this case you probably need to write Node-API binding for Node.js and `embind` binding for Emscripten WebAssembly. Look, you just want to make your native dependencies could be used in JavaScript world but you are doing duplicated things.

In fact, `emnapi` should be slower and more expensive than `embind` for invoking binding function. But it still be worth to use when you highly expect to share the Node-API binding code.

## Browser Compatibility

Let's forget IE.

`emnapi` JavaScript code is all ES5, but requires ES6 globals like `WeakMap`, and [some of APIs](/reference/list.html) requires `BigInt`, `WeakRef` and `FinalizationRegistry` which is very new in ECMA Standard, so if you are using those APIs, your code will not work on old browsers or old version Node.js. You can click the link to see which browsers support [WeakRef](https://www.caniuse.com/?search=WeakRef) 和 [FinalizationRegistry](https://www.caniuse.com/?search=FinalizationRegistry)。Taking Chrome as an example, the recommended target browser version is higher than Chrome 84.

## Is it ready for production?

All Node.js official test passed! The functionality could be guaranteed.

The performance has not been tested enough, it should be within an acceptable range, use it at your own risk. You can also try to [make emnapi be better](https://github.com/toyobayashi/emnapi/pulls)!
