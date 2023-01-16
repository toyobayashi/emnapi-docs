import{_ as e,o as a,c as d,a as i}from"./app.ccbb5984.js";const f='{"title":"\u5E38\u89C1\u95EE\u9898","description":"","frontmatter":{},"headers":[{"level":2,"title":"emnapi \u548C\u539F\u751F Node-API \u6709\u4EC0\u4E48\u533A\u522B","slug":"emnapi-\u548C\u539F\u751F-node-api-\u6709\u4EC0\u4E48\u533A\u522B"},{"level":2,"title":"\u6211\u4EC0\u4E48\u65F6\u5019\u5E94\u8BE5\u7528 emnapi","slug":"\u6211\u4EC0\u4E48\u65F6\u5019\u5E94\u8BE5\u7528-emnapi"},{"level":2,"title":"\u5982\u4F55\u79FB\u690D\u73B0\u6210\u7684\u7528 Node-API \u7F16\u5199 Node.js \u6269\u5C55","slug":"\u5982\u4F55\u79FB\u690D\u73B0\u6210\u7684\u7528-node-api-\u7F16\u5199-node-js-\u6269\u5C55"}],"relativePath":"zh/guide/faq.md","lastUpdated":1673845773000}',o={},n=i('<h1 id="\u5E38\u89C1\u95EE\u9898" tabindex="-1">\u5E38\u89C1\u95EE\u9898 <a class="header-anchor" href="#\u5E38\u89C1\u95EE\u9898" aria-hidden="true">#</a></h1><h2 id="emnapi-\u548C\u539F\u751F-node-api-\u6709\u4EC0\u4E48\u533A\u522B" tabindex="-1"><code>emnapi</code> \u548C\u539F\u751F Node-API \u6709\u4EC0\u4E48\u533A\u522B <a class="header-anchor" href="#emnapi-\u548C\u539F\u751F-node-api-\u6709\u4EC0\u4E48\u533A\u522B" aria-hidden="true">#</a></h2><ul><li><p><code>emnapi</code> \u7684\u5927\u90E8\u5206 API \u662F\u7531 JavaScript \u5B9E\u73B0\u7684\uFF0C\u800C\u539F\u751F Node-API \u662F\u7531 Node.js C++ \u4EE3\u7801\u5B9E\u73B0\u7684\uFF0C\u5E76\u4E14\u53EF\u4EE5\u5B8C\u5168\u8BBF\u95EE V8 \u5F15\u64CE\u3002</p></li><li><p><code>emnapi</code> \u7531 Emscripten \u7F16\u8BD1\u6210 WebAssembly\uFF0C\u800C\u539F\u751F Node-API \u88AB\u7F16\u8BD1\u6210 Node.js \u6269\u5C55\uFF08<code>.node</code> \u662F\u64CD\u4F5C\u7CFB\u7EDF\u52A8\u6001\u94FE\u63A5\u5E93\uFF09\uFF0C\u53EF\u4EE5\u4F7F\u7528\u64CD\u4F5C\u7CFB\u7EDF API\u3002</p></li><li><p><code>emnapi</code> \u6CA1\u6709 Node.js \u7279\u5B9A\u7684 API\uFF0C\u4E00\u4E9B API \u4F9D\u8D56\u4E8E\u5BBF\u4E3B JavaScript \u73AF\u5883\uFF0C\u8BF7\u53C2\u9605 <a href="/emnapi-docs/zh/reference/list.html">API \u5217\u8868</a></p></li><li><p>\u5982\u679C\u8FD0\u884C\u65F6\u652F\u6301 <code>FinalizationRegistry</code> \u548C <code>WeakRef</code>\uFF0C\u5219\u4F7F\u7528 <code>emnapi</code> \u65F6\u53EF\u4EE5\u76F4\u63A5\u4F7F\u7528\u5185\u7F6E\u7684 <code>node-addon-api</code>\u3002</p></li></ul><h2 id="\u6211\u4EC0\u4E48\u65F6\u5019\u5E94\u8BE5\u7528-emnapi" tabindex="-1">\u6211\u4EC0\u4E48\u65F6\u5019\u5E94\u8BE5\u7528 <code>emnapi</code> <a class="header-anchor" href="#\u6211\u4EC0\u4E48\u65F6\u5019\u5E94\u8BE5\u7528-emnapi" aria-hidden="true">#</a></h2><ul><li>\u4F60\u66F4\u559C\u6B22 Node-API\uFF0C\u5E76\u4E14\u76F8\u6BD4\u4E8E <code>embind</code> \u4F60\u66F4\u719F\u6089 Node-API\u3002</li><li>\u4F60\u5E0C\u671B\u5C06\u4F60\u7684\uFF08\u6216\u73B0\u6210\u7684\uFF09\u7528 Node-API \u7F16\u5199\u7684 Node.js \u6269\u5C55\u79FB\u690D\u5230 WebAssembly\u3002</li></ul><h2 id="\u5982\u4F55\u79FB\u690D\u73B0\u6210\u7684\u7528-node-api-\u7F16\u5199-node-js-\u6269\u5C55" tabindex="-1">\u5982\u4F55\u79FB\u690D\u73B0\u6210\u7684\u7528 Node-API \u7F16\u5199 Node.js \u6269\u5C55 <a class="header-anchor" href="#\u5982\u4F55\u79FB\u690D\u73B0\u6210\u7684\u7528-node-api-\u7F16\u5199-node-js-\u6269\u5C55" aria-hidden="true">#</a></h2><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>\u79FB\u690D\u91CD\u5EA6\u4F7F\u7528\u64CD\u4F5C\u7CFB\u7EDF API\uFF08\u5C24\u5176\u662F\u5927\u91CF\u4F7F\u7528 <code>Windows.h</code>\uFF09\u7684\u539F\u751F\u6269\u5C55\u662F\u975E\u5E38\u56F0\u96BE\u7684\u3002</p><p>\u5982\u679C\u8FD0\u884C\u65F6\u4E0D\u652F\u6301 <code>FinalizationRegistry</code> \u548C <code>WeakRef</code>\u5219<strong>\u4E0D\u80FD</strong>\u4F7F\u7528 node-addon-api\u3002</p></div><ol><li>\u68C0\u67E5\u6269\u5C55\u4E2D\u4F7F\u7528\u7684\u6240\u6709 API \u662F\u5426\u5728 <code>emnapi</code> \u4E2D\u5DF2\u88AB\u5B9E\u73B0\u3002\u8BF7\u53C2\u9605 <a href="/emnapi-docs/zh/reference/list.html">API \u5217\u8868</a>\u3002</li><li>\u5728\u8C03\u7528 <code>napi_create_reference</code> / <code>napi_wrap</code> \u4E4B\u524D\u4F7F\u7528 <a href="/emnapi-docs/zh/reference/additional.html#emnapi-is-support-weakref">emnapi_is_support_weakref</a> \u68C0\u67E5\u8FD0\u884C\u65F6\u7684\u5F31\u5F15\u7528\u652F\u6301\u3002</li><li>\u68C0\u67E5\u662F\u5426\u9700\u8981\u540C\u6B65 wasm \u5185\u5B58\uFF0C\u6839\u636E <a href="/emnapi-docs/zh/reference/list.html#arraybuffer-\u76F8\u5173">ArrayBuffer \u76F8\u5173\u7684 API</a></li><li>\u7F16\u5199 CMakeLists\u3002\u4E0D\u652F\u6301 node-gyp\u3002</li></ol>',8),c=[n];function r(t,s,l,p,h,m){return a(),d("div",null,c)}var A=e(o,[["render",r]]);export{f as __pageData,A as default};