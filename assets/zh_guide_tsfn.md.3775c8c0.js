import{_ as e,o as a,c as t,a as r}from"./app.58384371.js";const u=JSON.parse('{"title":"线程安全函数","description":"","frontmatter":{},"headers":[],"relativePath":"zh/guide/tsfn.md","lastUpdated":1675863400000}'),n={name:"zh/guide/tsfn.md"},i=r('<h1 id="线程安全函数" tabindex="-1">线程安全函数 <a class="header-anchor" href="#线程安全函数" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>仅在 Emscripten 中支持</p></div><ul><li><a href="https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_create_threadsafe_function" target="_blank" rel="noreferrer">napi_create_threadsafe_function</a></li><li><a href="https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_get_threadsafe_function_context" target="_blank" rel="noreferrer">napi_get_threadsafe_function_context</a></li><li><a href="https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_call_threadsafe_function" target="_blank" rel="noreferrer">napi_call_threadsafe_function</a></li><li><a href="https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_acquire_threadsafe_function" target="_blank" rel="noreferrer">napi_acquire_threadsafe_function</a></li><li><a href="https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_release_threadsafe_function" target="_blank" rel="noreferrer">napi_release_threadsafe_function</a></li></ul><p>需要启用 pthreads，在<a href="/emnapi-docs/zh/guide/multithreaded-async.html">这里</a>查看如何使用多线程。</p><p><a href="https://github.com/toyobayashi/node-addon-examples/tree/emnapi/async_work_thread_safe_function/napi" target="_blank" rel="noreferrer">在这里查看示例</a>。</p>',5),s=[i];function _(o,d,c,l,p,h){return a(),t("div",null,s)}const m=e(n,[["render",_]]);export{u as __pageData,m as default};
