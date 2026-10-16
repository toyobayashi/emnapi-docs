---
sidebarDepth: 2
---

<script setup>

import { withBase } from 'vitepress'

</script>

# What is emnapi

<img :src="withBase('/emnapi.svg')" alt="emnapi logo" width="256" />

emnapi is a JavaScript implementation of the Node-API runtime for WebAssembly addons. It supports Emscripten, wasi-sdk, and clang toolchains, with APIs and platform limits documented in the [API list](/v2/reference/list.html).

The project helps port Node-API addons to WebAssembly with few source changes and aims to keep runtime behavior close to Node.js where the host environment allows it. emnapi also powers the WebAssembly feature used by napi-rs and enables native addons to run in environments such as StackBlitz WebContainers.

## Why not embind

embind is a good choice when you do not need the same Node-API binding code in Node.js and WebAssembly environments. If you maintain separate Node.js and Emscripten bindings today, emnapi may let you share more of the Node-API addon source.

## Host and browser requirements

emnapi implements its runtime in JavaScript, so support depends on the host's JavaScript features. APIs involving BigInt, WeakRef, FinalizationRegistry, Buffer, SharedArrayBuffer, or workers have the corresponding runtime requirements and limitations listed in the [API reference](/v2/reference/list.html).

Browser builds that use pthreads and shared WebAssembly memory need cross-origin isolation. The V2 guide describes the required headers in [Multithreaded Asynchronous Operations](/v2/guide/multithreaded-async.html).

emnapi 2.0.0-beta.2 is a pre-release. The V8 API shim remains experimental and incomplete; see [V8 API shim and NAN](/v2/guide/v8-nan.html). For changes to JavaScript API names, see [Migrating from emnapi v1](/v2/guide/migration-from-v1.html).

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/toyobayashi/toyobayashi/sponsorkit/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/toyobayashi/toyobayashi/sponsorkit/sponsors.svg'/>
  </a>
</p>
