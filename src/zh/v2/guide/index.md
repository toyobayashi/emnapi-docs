---
sidebarDepth: 2
---

<script setup>

import { withBase } from 'vitepress'

</script>

# 什么是 emnapi

<img :src="withBase('/emnapi.svg')" alt="emnapi logo" width="256" />

emnapi 是面向 WebAssembly addon 的 JavaScript Node-API 运行时实现，支持 Emscripten、wasi-sdk 和 clang 工具链。具体支持的 API 与平台限制见 [API 列表](/zh/v2/reference/list.html)。

本项目旨在帮助开发者以较少的源码改动将 Node-API addon 移植到 WebAssembly，并在宿主环境允许的范围内尽量保持与 Node.js 接近的运行行为。emnapi 也为 napi-rs 的 WebAssembly 功能提供支持，并让原生 addon 能在 StackBlitz WebContainer 等环境中运行。

## 为什么不用 embind

如果不需要在 Node.js 和 WebAssembly 环境中共用同一套 Node-API 绑定代码，embind 是很好的选择。如果目前需要分别维护 Node.js 和 Emscripten 绑定，emnapi 可以帮助你复用更多 Node-API addon 源码。

## 宿主和浏览器要求

emnapi 的运行时由 JavaScript 实现，因此具体支持取决于宿主的 JavaScript 功能。涉及 BigInt、WeakRef、FinalizationRegistry、Buffer、SharedArrayBuffer 或 worker 的 API 有相应的运行时要求与限制，详见 [API 参考](/zh/v2/reference/list.html)。

浏览器 pthread 构建和共享 WebAssembly 内存需要跨源隔离。V2 指南在[多线程异步操作](/zh/v2/guide/multithreaded-async.html)中列出了所需响应头。

emnapi 2.0.0-beta.2 是预发布版本。V8 API 兼容层仍处于实验阶段且尚未完整实现，详见[实验性 V8 API 兼容层与 NAN](/zh/v2/guide/v8-nan.html)。JavaScript API 名称变更见[从 emnapi v1 迁移](/zh/v2/guide/migration-from-v1.html)。

## 赞助者

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/toyobayashi/toyobayashi/sponsorkit/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/toyobayashi/toyobayashi/sponsorkit/sponsors.svg'/>
  </a>
</p>
