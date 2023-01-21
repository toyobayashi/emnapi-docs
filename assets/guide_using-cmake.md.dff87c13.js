import{_ as s,o as a,c as n,a as e}from"./app.96092cb2.js";const D=JSON.parse('{"title":"Using CMake","description":"","frontmatter":{},"headers":[],"relativePath":"guide/using-cmake.md","lastUpdated":1674282702000}'),l={name:"guide/using-cmake.md"},p=e(`<h1 id="using-cmake" tabindex="-1">Using CMake <a class="header-anchor" href="#using-cmake" aria-hidden="true">#</a></h1><p>See <a href="/emnapi-docs/guide/getting-started.html">Getting Started</a> for environment setup.</p><p>Create <code>CMakeLists.txt</code>.</p><div class="language-cmake"><button title="Copy Code" class="copy"></button><span class="lang">cmake</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">cmake_minimum_required</span><span style="color:#A6ACCD;">(VERSION 3.13)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">project</span><span style="color:#A6ACCD;">(emnapiexample)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">add_subdirectory</span><span style="color:#A6ACCD;">(</span><span style="color:#C3E88D;">&quot;\${CMAKE_CURRENT_SOURCE_DIR}/node_modules/@tybys/emnapi&quot;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">add_executable</span><span style="color:#A6ACCD;">(hello hello.c)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># or add_executable(hello hello.cpp)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">target_link_libraries</span><span style="color:#A6ACCD;">(hello emnapi_full)</span></span>
<span class="line"><span style="color:#A6ACCD;">target_link_options(hello PRIVATE</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C3E88D;">&quot;-sEXPORTED_FUNCTIONS=[&#39;_malloc&#39;,&#39;_free&#39;]&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><p>Building with <code>emcmake</code>, output <code>build/hello.js</code> and <code>build/hello.wasm</code>.</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#FFCB6B;">mkdir</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">emcmake</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">cmake</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-DCMAKE_BUILD_TYPE=Release</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-G</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">Ninja</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-H.</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-Bbuild</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># emcmake cmake -DCMAKE_BUILD_TYPE=Release -G &quot;Unix Makefiles&quot; -H. -Bbuild</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># emcmake cmake -DCMAKE_BUILD_TYPE=Release -G &quot;MinGW Makefiles&quot; -H. -Bbuild</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># emcmake cmake -DCMAKE_BUILD_TYPE=Release -G &quot;NMake Makefiles&quot; -H. -Bbuild</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">cmake</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--build</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">build</span></span>
<span class="line"></span></code></pre></div>`,6),o=[p];function t(c,i,r,C,d,y){return a(),n("div",null,o)}const u=s(l,[["render",t]]);export{D as __pageData,u as default};
