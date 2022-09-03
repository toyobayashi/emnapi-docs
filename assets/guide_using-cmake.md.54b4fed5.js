import{_ as a,o as n,c as e,a as s}from"./app.4129c746.js";const _='{"title":"Using CMake","description":"","frontmatter":{},"headers":[],"relativePath":"guide/using-cmake.md","lastUpdated":1662188630000}',t={},o=s(`<h1 id="using-cmake" tabindex="-1">Using CMake <a class="header-anchor" href="#using-cmake" aria-hidden="true">#</a></h1><p>See <a href="/emnapi-docs/guide/getting-started.html#cmake">Getting Started</a> for environment setup.</p><p>Create <code>CMakeLists.txt</code>.</p><div class="language-cmake"><pre><code><span class="token keyword">cmake_minimum_required</span><span class="token punctuation">(</span><span class="token property">VERSION</span> <span class="token number">3.13</span><span class="token punctuation">)</span>

<span class="token keyword">project</span><span class="token punctuation">(</span>emnapiexample<span class="token punctuation">)</span>

<span class="token keyword">add_subdirectory</span><span class="token punctuation">(</span><span class="token string">&quot;<span class="token interpolation"><span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_SOURCE_DIR</span><span class="token punctuation">}</span></span>/node_modules/@tybys/emnapi&quot;</span><span class="token punctuation">)</span>

<span class="token keyword">add_executable</span><span class="token punctuation">(</span>hello hello.c<span class="token punctuation">)</span>
<span class="token comment"># or add_executable(hello hello.cpp)</span>

<span class="token keyword">target_link_libraries</span><span class="token punctuation">(</span>hello emnapi_full<span class="token punctuation">)</span>
<span class="token keyword">target_link_options</span><span class="token punctuation">(</span>hello <span class="token namespace">PRIVATE</span>
  <span class="token string">&quot;-sEXPORTED_FUNCTIONS=[&#39;_malloc&#39;,&#39;_free&#39;]&quot;</span>
<span class="token punctuation">)</span>
</code></pre></div><p>Building with <code>emcmake</code>, output <code>build/hello.js</code> and <code>build/hello.wasm</code>.</p><div class="language-bash"><pre><code><span class="token function">mkdir</span> build
emcmake cmake <span class="token parameter variable">-DCMAKE_BUILD_TYPE</span><span class="token operator">=</span>Release -H. <span class="token parameter variable">-Bbuild</span>

<span class="token comment"># Windows</span>
<span class="token comment"># emcmake cmake -DCMAKE_BUILD_TYPE=Release -G &quot;MinGW Makefiles&quot; -H. -Bbuild</span>

cmake <span class="token parameter variable">--build</span> build
</code></pre></div><p>If you have not installed <code>make</code> or <code>mingw32-make</code> on Windows, execute commands below in <code>Visual Studio Developer Command Prompt</code>.</p><div class="language-bash"><pre><code><span class="token function">mkdir</span> build
emcmake cmake <span class="token parameter variable">-DCMAKE_BUILD_TYPE</span><span class="token operator">=</span>Release <span class="token parameter variable">-DCMAKE_MAKE_PROGRAM</span><span class="token operator">=</span>nmake <span class="token parameter variable">-G</span> <span class="token string">&quot;NMake Makefiles&quot;</span> -H. <span class="token parameter variable">-Bbuild</span>
cmake <span class="token parameter variable">--build</span> build
</code></pre></div>`,8),p=[o];function c(l,i,r,d,k,u){return n(),e("div",null,p)}var b=a(t,[["render",c]]);export{_ as __pageData,b as default};
