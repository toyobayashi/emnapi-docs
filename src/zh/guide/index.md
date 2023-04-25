---
sidebarDepth: 2
---

<script setup>

import { withBase } from 'vitepress'

</script>

# 什么是 emnapi

<img :src="withBase('/emnapi.svg')" alt="emnapi logo" width="256" />

`emnapi` 适用于 Emscripten 的 [Node-API](https://nodejs.org/docs/v16.15.0/api/n-api.html) 接近完整的实现，从 v0.29.0 版本开始支持 [wasi-sdk](https://github.com/WebAssembly/wasi-sdk) 和 clang `wasm32-unknown-unknown` 构建目标，[napi-rs 正在支持中](https://github.com/napi-rs/napi-rs/issues/796)。

## 动机

本项目的目标是：

- 帮助用户将他们的或现有的 Node-API 原生插件尽可能少地更改代码移植到 wasm。
- 使运行时行为尽可能匹配原生 Node.js。

## 为什么不用 `embind`

如果你不需要在浏览器和 Node.js 上运行相同的 Node-API 绑定代码，`embind` 非常好。使用 `embind` 编译成 wasm 也可以让你的代码同时在浏览器和 Node.js 上运行，但是当以 Node.js 为目标时，我们更倾向于编译到 Node.js 原生模块而不是 wasm 以获得原生性能。因此，在这种情况下，你可能需要为 Node.js 编写 Node-API 绑定，并为 Emscripten WebAssembly 编写 `embind` 绑定。你只是想让你的原生依赖项可以在 JavaScript 世界中使用，但你正在做重复的事情。

emnapi 的另一个使用场景是将 Node-API 原生扩展跑在 [StackBlitz](https://stackblitz.com/) 的 WebContainer 上。

## 浏览器兼容性

先把 IE 忘掉吧。

`emnapi` 发布的 JavaScript 代码都是 ES5，但需要 ES6 全局变量，例如 `WeakMap`，并且[一些 API](/zh/reference/list.html) 需要 `BigInt`、`WeakRef` 和 `FinalizationRegistry`，这在 ES 标准中是非常新的，所以如果你用到了这些 API，你的代码将无法在稍微旧点的浏览器或旧版本 Node.js 上运行。你可以点击链接查看哪些浏览器支持 [WeakRef](https://www.caniuse.com/?search=WeakRef) 和 [FinalizationRegistry](https://www.caniuse.com/?search=FinalizationRegistry)。以 Chrome 为例，推荐目标浏览器版本高于 Chrome 84。

## 可用于生产环境吗

所有 Node.js 官方测试通过！功能可以得到保证。

经过简单测试，发现一般场景下绑定的调用开销比 embind 略大，但应在可接受的范围内。

1.0 版本即将到来，目前并没有发布，因为用于内部实现的运行时 API 可能还需要频繁重构与变更，但这不影响用户使用 Node-API 本身的稳定 API。

你也可以试试[让 emnapi 变得更好](https://github.com/toyobayashi/emnapi/pulls)！
