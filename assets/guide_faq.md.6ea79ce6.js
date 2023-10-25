import{_ as e,o as i,c as a,Q as o}from"./chunks/framework.c6d1d410.js";const f=JSON.parse('{"title":"Frequently Asked Questions","description":"","frontmatter":{},"headers":[],"relativePath":"guide/faq.md","filePath":"guide/faq.md","lastUpdated":1698229211000}'),t={name:"guide/faq.md"},n=o('<h1 id="frequently-asked-questions" tabindex="-1">Frequently Asked Questions <a class="header-anchor" href="#frequently-asked-questions" aria-label="Permalink to &quot;Frequently Asked Questions&quot;">​</a></h1><h2 id="what-is-the-difference-between-emnapi-and-native-node-api" tabindex="-1">What is the difference between <code>emnapi</code> and native Node-API <a class="header-anchor" href="#what-is-the-difference-between-emnapi-and-native-node-api" aria-label="Permalink to &quot;What is the difference between `emnapi` and native Node-API&quot;">​</a></h2><ul><li><p>Most <code>emnapi</code>&#39;s APIs are implemented by JavaScript, while native Node-API is implemented by Node.js C++ code and has full access to V8 engine.</p></li><li><p><code>emnapi</code> is compiled to WebAssembly by Emscripten, while native Node-API is compiled to Node.js addon (<code>.node</code> is operating system shared library) and can use operating system APIs.</p></li><li><p><code>emnapi</code> has no Node.js specific APIs, some of APIs depends the host JavaScript environment. In particular, WebAssembly does not share heap memory with the host, and the API related to ArrayBuffer has certain limitations. see <a href="/emnapi-docs/reference/list.html">API List</a></p></li><li><p>Using <code>emnapi</code> is able to use the builtin <code>node-addon-api</code> out of box if the if the runtime support <code>FinalizationRegistry</code> and <code>WeakRef</code>.</p></li></ul><h2 id="when-should-i-use-emnapi" tabindex="-1">When should I use <code>emnapi</code> <a class="header-anchor" href="#when-should-i-use-emnapi" aria-label="Permalink to &quot;When should I use `emnapi`&quot;">​</a></h2><ul><li>You prefer Node-API, and you are more familiar with Node-API than <code>embind</code>.</li><li>You want to port your (or existing) Node.js addon written in Node-API to WebAssembly.</li><li>You want your native module npm package to be installed smoothly by users without having to deal with node-gyp.</li></ul><h2 id="how-to-port-existing-node-js-addon-written-in-node-api" tabindex="-1">How to port existing Node.js addon written in Node-API <a class="header-anchor" href="#how-to-port-existing-node-js-addon-written-in-node-api" aria-label="Permalink to &quot;How to port existing Node.js addon written in Node-API&quot;">​</a></h2><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>It is very difficult to port a native addon which has heavy use of operating system APIs (especially heavy use of <code>Windows.h</code>).</p><p>You <strong>can not</strong> use node-addon-api if the runtime does not support <code>FinalizationRegistry</code> and <code>WeakRef</code>.</p></div><ol><li>Checking if all APIs used in the addon are implemented in <code>emnapi</code>. See <a href="/emnapi-docs/reference/list.html">API List</a>.</li><li>Checking runtime weak reference support by using <a href="/emnapi-docs/reference/additional.html#emnapi-is-support-weakref">emnapi_is_support_weakref</a> before calling <code>napi_create_reference</code> / <code>napi_wrap</code>.</li><li>Checking if it is necessary to sync wasm memory according to <a href="/emnapi-docs/reference/list.html#arraybuffer-related">ArrayBuffer Related API</a></li><li>Writing CMakeLists. node-gyp is not supported.</li></ol>',8),d=[n];function s(r,l,c,p,h,u){return i(),a("div",null,d)}const y=e(t,[["render",s]]);export{f as __pageData,y as default};
