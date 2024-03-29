---
title: emnapi
layout: home

hero:
  image:
    src: /emnapi.svg
    alt: emnapi image
  name: emnapi
  text: 适用于 WebAssembly 的 Node-API 实现
  tagline: |

    将 Node.js 原生模块带到浏览器！
  actions:
  - theme: brand
    text: 开始使用
    link: /zh/guide/
  - theme: alt
    text: 在 Github 上查看
    link: https://github.com/toyobayashi/emnapi

features:
  - title: 代码的移植性
    details: 几乎不需要更改代码即可在浏览器上运行你的 Node-API 原生模块。
  - title: 多工具链支持
    details: 支持 Emscripten、wasi-sdk、裸 wasm32、napi-rs。
  - title: 真正的多线程
    details: 通过移植的 libuv 线程池和 Web Worker 支持异步工作和线程安全函数。

footer:
  license: MIT Licensed
  since: 2021
  author:
    name: toyobayashi
---
