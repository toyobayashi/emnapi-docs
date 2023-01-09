import{_ as a,o as n,c as s,a as e}from"./app.e4baf8de.js";const _='{"title":"\u4F7F\u7528 CMake","description":"","frontmatter":{},"headers":[],"relativePath":"zh/guide/using-cmake.md","lastUpdated":1673280266000}',t={},o=e(`<h1 id="\u4F7F\u7528-cmake" tabindex="-1">\u4F7F\u7528 CMake <a class="header-anchor" href="#\u4F7F\u7528-cmake" aria-hidden="true">#</a></h1><p>\u73AF\u5883\u5B89\u88C5\u8BF7\u53C2\u8003<a href="/emnapi-docs/zh/guide/getting-started.html">\u5F00\u59CB\u4F7F\u7528</a>\u7AE0\u8282</p><p>\u521B\u5EFA <code>CMakeLists.txt</code>\u3002</p><div class="language-cmake"><pre><code><span class="token keyword">cmake_minimum_required</span><span class="token punctuation">(</span><span class="token property">VERSION</span> <span class="token number">3.13</span><span class="token punctuation">)</span>

<span class="token keyword">project</span><span class="token punctuation">(</span>emnapiexample<span class="token punctuation">)</span>

<span class="token keyword">add_subdirectory</span><span class="token punctuation">(</span><span class="token string">&quot;<span class="token interpolation"><span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_SOURCE_DIR</span><span class="token punctuation">}</span></span>/node_modules/@tybys/emnapi&quot;</span><span class="token punctuation">)</span>

<span class="token keyword">add_executable</span><span class="token punctuation">(</span>hello hello.c<span class="token punctuation">)</span>
<span class="token comment"># or add_executable(hello hello.cpp)</span>

<span class="token keyword">target_link_libraries</span><span class="token punctuation">(</span>hello emnapi_full<span class="token punctuation">)</span>
<span class="token keyword">target_link_options</span><span class="token punctuation">(</span>hello <span class="token namespace">PRIVATE</span>
  <span class="token string">&quot;-sEXPORTED_FUNCTIONS=[&#39;_malloc&#39;,&#39;_free&#39;]&quot;</span>
<span class="token punctuation">)</span>
</code></pre></div><p>\u7528 <code>emcmake</code> \u6784\u5EFA\uFF0C\u8F93\u51FA <code>build/hello.js</code> \u548C <code>build/hello.wasm</code>\u3002</p><div class="language-bash"><pre><code><span class="token function">mkdir</span> build
emcmake cmake <span class="token parameter variable">-DCMAKE_BUILD_TYPE</span><span class="token operator">=</span>Release <span class="token parameter variable">-G</span> Ninja -H. <span class="token parameter variable">-Bbuild</span>
<span class="token comment"># emcmake cmake -DCMAKE_BUILD_TYPE=Release -G &quot;Unix Makefiles&quot; -H. -Bbuild</span>
<span class="token comment"># emcmake cmake -DCMAKE_BUILD_TYPE=Release -G &quot;MinGW Makefiles&quot; -H. -Bbuild</span>
<span class="token comment"># emcmake cmake -DCMAKE_BUILD_TYPE=Release -G &quot;NMake Makefiles&quot; -H. -Bbuild</span>

cmake <span class="token parameter variable">--build</span> build
</code></pre></div>`,6),p=[o];function c(l,i,k,r,u,d){return n(),s("div",null,p)}var h=a(t,[["render",c]]);export{_ as __pageData,h as default};
