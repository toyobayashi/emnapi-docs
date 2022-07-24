# 常见问题

## `emnapi` 和原生 Node-API 有什么区别

- `emnapi` 的大部分 API 是由 JavaScript 实现的，而原生 Node-API 是由 Node.js C++ 代码实现的，并且可以完全访问 V8 引擎。

- `emnapi` 由 Emscripten 编译成 WebAssembly，而原生 Node-API 被编译成 Node.js 扩展（`.node` 是操作系统动态链接库），可以使用操作系统 API。

- `emnapi` 没有 Node.js 特定的 API，一些 API 依赖于宿主 JavaScript 环境，请参阅 [API 列表](/zh/reference/list.html)

- 如果运行时支持 `FinalizationRegistry` 和 `WeakRef`，则使用 `emnapi` 时可以直接使用内置的 `node-addon-api`。

## 我什么时候应该用 `emnapi`

- 你想在 Node.js 和浏览器上运行同一套 C/C++ 代码。
- 你更喜欢 Node-API，并且相比于 `embind` 你更熟悉 Node-API。
- 你希望将现成的用 Node-API 编写的 Node.js 扩展移植到 WebAssembly。

## 我什么时候不应该用 `emnapi`

- 高性能要求，担心调用开销。

## 如何移植现成的用 Node-API 编写 Node.js 扩展

::: warning

移植重度使用操作系统 API（尤其是大量使用 `Windows.h`）的原生扩展是非常困难的。

如果运行时不支持 `FinalizationRegistry` 和 `WeakRef`则**不能**使用 node-addon-api。

:::

1. 检查扩展中使用的所有 API 是否在 `emnapi` 中已被实现。请参阅 [API 列表](/zh/reference/list.html)。
2. 在调用 `napi_create_reference` / `napi_wrap` 之前使用 [emnapi_is_support_weakref](/zh/reference/additional.html#emnapi-is-support-weakref) 检查运行时的弱引用支持。
3. 编写 CMakeLists。不支持 node-gyp。
