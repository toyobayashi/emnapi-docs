---
sidebarDepth: 2
---

<script setup>

import { withBase } from 'vitepress'

</script>

# What is emnapi

<img :src="withBase('/emnapi.svg')" alt="emnapi logo" width="256" />

`emnapi` is ~~a subset of~~ almost a full [**N**ode-**API**](https://nodejs.org/docs/v16.15.0/api/n-api.html) (named NAPI previously) implementation for **Em**scripten, as well as [wasi-sdk](https://github.com/WebAssembly/wasi-sdk) and clang `wasm32-unknown-unknown` target from emnapi v0.29.0.

Emscripten is the first class support target.

## Motivation

This project aims to

- Help users port their or existing Node-API native addons to wasm with code change as less as possible.
- Make runtime behavior matches native Node.js as much as possible.

## Why not `embind`

`embind` is pretty good if you don't need to running same Node-API binding code on both browser and Node.js. Compiling to wasm by using `embind` can also make your code running on both browser and Node.js, but when targeting Node.js, we prefer compiling to Node.js native addon instead of wasm for native performance. So in this case you probably need to write Node-API binding for Node.js and `embind` binding for Emscripten WebAssembly. Look, you just want to make your native dependencies could be used in JavaScript world but you are doing duplicated things.

Another use case of emnapi is that you want to make your addon run on [StackBlitz](https://stackblitz.com/)'s WebContainer.

## Browser Compatibility

Let's forget IE.

`emnapi` JavaScript code is all ES5, but requires ES6 globals like `WeakMap`, and [some of APIs](/reference/list.html) requires `BigInt`, `WeakRef` and `FinalizationRegistry` which is very new in ECMA Standard, so if you are using those APIs, your code will not work on old browsers or old version Node.js. You can click the link to see which browsers support [WeakRef](https://www.caniuse.com/?search=WeakRef) 和 [FinalizationRegistry](https://www.caniuse.com/?search=FinalizationRegistry)。Taking Chrome as an example, the recommended target browser version is higher than Chrome 84.

## Is it ready for production?

All Node.js official test passed! The functionality could be guaranteed. There are already well-known open source projects that are using or will use emnapi:

- [sharp](https://github.com/lovell/sharp) on StackBlitz is using emnapi, see [official blog](https://blog.stackblitz.com/posts/bringing-sharp-to-wasm-and-webcontainers/)
- [napi-rs](https://github.com/napi-rs/napi-rs) [has integrated emnapi](https://github.com/napi-rs/napi-rs/pull/1669) (v2.14.0+)
- [node-magickwand](https://github.com/mmomtchev/magickwand.js) as a Node-API showcase project of [SWIG](https://github.com/swig/swig), has integrated emnapi

After simple testing, found the call overhead of binding is slightly greater than that of embind in general scenarios,
but it should be within an acceptable range.

1.0 is comming soon, currently is not released, as the runtime API for internal implementation may need to be refactored and changed frequently, but this does not affect users to use Node-API's own stable API.

You can also try to [make emnapi be better](https://github.com/toyobayashi/emnapi/pulls)!
