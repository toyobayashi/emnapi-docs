import{_ as e,o as a,c as t,Q as r}from"./chunks/framework.c6d1d410.js";const u=JSON.parse('{"title":"线程安全函数","description":"","frontmatter":{},"headers":[],"relativePath":"zh/guide/tsfn.md","filePath":"zh/guide/tsfn.md","lastUpdated":1698230210000}'),n={name:"zh/guide/tsfn.md"},i=r('<h1 id="线程安全函数" tabindex="-1">线程安全函数 <a class="header-anchor" href="#线程安全函数" aria-label="Permalink to &quot;线程安全函数&quot;">​</a></h1><ul><li><a href="https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_create_threadsafe_function" target="_blank" rel="noreferrer">napi_create_threadsafe_function</a></li><li><a href="https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_get_threadsafe_function_context" target="_blank" rel="noreferrer">napi_get_threadsafe_function_context</a></li><li><a href="https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_call_threadsafe_function" target="_blank" rel="noreferrer">napi_call_threadsafe_function</a></li><li><a href="https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_acquire_threadsafe_function" target="_blank" rel="noreferrer">napi_acquire_threadsafe_function</a></li><li><a href="https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_release_threadsafe_function" target="_blank" rel="noreferrer">napi_release_threadsafe_function</a></li></ul><p>需要启用 pthreads，在<a href="/emnapi-docs/zh/guide/multithreaded-async.html">这里</a>查看如何使用多线程。</p><p><a href="https://github.com/toyobayashi/node-addon-examples/tree/emnapi/async_work_thread_safe_function/napi" target="_blank" rel="noreferrer">在这里查看示例</a>。</p>',4),_=[i];function s(o,d,l,c,h,f){return a(),t("div",null,_)}const m=e(n,[["render",s]]);export{u as __pageData,m as default};