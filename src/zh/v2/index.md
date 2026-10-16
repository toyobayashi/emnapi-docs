---
title: emnapi v2.0.0-beta.2 文档
layout: home

hero:
  image:
    src: /emnapi.svg
    alt: emnapi image
  name: emnapi
  text: emnapi v2.0.0-beta.2
  tagline: emnapi 2.x 预发布版本的文档。
  actions:
  - theme: brand
    text: 开始使用
    link: /zh/v2/guide/
  - theme: alt
    text: 在 Github 上查看
    link: https://github.com/toyobayashi/emnapi

features:
  - title: 代码的移植性
    details: 在 Node.js、浏览器和 WebAssembly 运行时之间运行 Node-API 原生模块。
  - title: 多工具链支持
    details: 文档涵盖 Emscripten、wasi-sdk、裸 wasm32 和 napi-rs。
  - title: 真正的多线程
    details: 通过移植的 libuv 线程池和 Web Worker 支持异步工作和线程安全函数。

footer:
  license: MIT Licensed
  since: 2021
  author:
    name: toyobayashi
---

::: warning Beta 版本

本文档描述 emnapi `2.0.0-beta.2`。V8 API 兼容层仍处于实验阶段且尚未完整实现。

:::
