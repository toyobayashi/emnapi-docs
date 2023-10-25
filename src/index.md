---
title: emnapi
layout: home

hero:
  image:
    src: /emnapi.svg
    alt: emnapi image
  name: emnapi
  text: Node-API Implementation for WebAssembly
  tagline: Bring Node.js native addon to browser!
  actions:
  - theme: brand
    text: Get Started
    link: ./guide/
  - theme: alt
    text: View on Github
    link: https://github.com/toyobayashi/emnapi

features:
  - title: Code Portability
    details: Running your Node-API native addon on browser with little code change.
  - title: Multiple Toolchain Support
    details: Supports Emscripten, wasi-sdk, bare wasm32 and napi-rs.
  - title: Real Multithreading
    details: Support multithreaded asynchronous operations (async work, thread safe functions) via ported libuv thread pool and Web Workers.

footer:
  license: MIT Licensed
  since: 2021
  author:
    name: toyobayashi
---
