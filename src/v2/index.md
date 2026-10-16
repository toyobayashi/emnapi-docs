---
title: emnapi v2.0.0-beta.2
layout: home

hero:
  image:
    src: /emnapi.svg
    alt: emnapi image
  name: emnapi
  text: emnapi v2.0.0-beta.2
  tagline: Beta documentation for the current emnapi 2.x prerelease.
  actions:
  - theme: brand
    text: Get Started
    link: ./guide/
  - theme: alt
    text: View on Github
    link: https://github.com/toyobayashi/emnapi

features:
  - title: Code Portability
    details: Run Node-API native addons across Node.js, browsers, and WebAssembly runtimes.
  - title: Multiple Toolchain Support
    details: Covers Emscripten, wasi-sdk, bare wasm32 and napi-rs.
  - title: Real Multithreading
    details: Support multithreaded asynchronous operations (async work, thread safe functions) via ported libuv thread pool and Web Workers.

footer:
  license: MIT Licensed
  since: 2021
  author:
    name: toyobayashi
---

::: warning Beta release

This documentation describes emnapi `2.0.0-beta.2`. The V8 API shim is experimental and incomplete.

:::
