---
sidebarDepth: 2
---

# 什么是 emnapi

`emnapi` 适用于 Emscripten 的 Node-API 子集实现。

## 动机

我构建这个库的目的是为了能够在尽可能不更改 C/C++ 代码的情况下将 Node-API 代码无缝编译成 Emscripten WebAssembly。

## 为什么不用 `embind`

如果你不需要在浏览器和 Node.js 上运行相同的 Node-API 绑定代码，`embind` 非常好。使用 `embind` 编译成 wasm 也可以让你的代码同时在浏览器和 Node.js 上运行，但是当以 Node.js 为目标时，我们更倾向于编译到 Node.js 原生模块而不是 wasm 以获得原生性能。因此，在这种情况下，你可能需要为 Node.js 编写 Node-API 绑定，并为 Emscripten WebAssembly 编写 `embind` 绑定。你只是想让你的原生依赖项可以在 JavaScript 世界中使用，但你正在做重复的事情。

事实上，在调用绑定函数时，`emnapi` 应该比 `embind` 更慢且更昂贵。但是当你非常希望共享 Node-API 绑定代码时，它仍然值得使用。

## 可用于生产环境吗

所有 Node.js 官方测试通过！功能可以得到保证。

性能未经充分测试，应该在可接受的范围内，使用风险自负。你也可以试试[让 emnapi 变得更好](https://github.com/toyobayashi/emnapi/pulls)！
