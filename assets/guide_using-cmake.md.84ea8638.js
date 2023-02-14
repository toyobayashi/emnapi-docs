import{_ as s,o as n,c as a,a as l}from"./app.58384371.js";const _=JSON.parse('{"title":"Using CMake","description":"","frontmatter":{},"headers":[],"relativePath":"guide/using-cmake.md","lastUpdated":1676357086000}'),p={name:"guide/using-cmake.md"},o=l(`<h1 id="using-cmake" tabindex="-1">Using CMake <a class="header-anchor" href="#using-cmake" aria-hidden="true">#</a></h1><p>See <a href="/emnapi-docs/guide/getting-started.html">Getting Started</a> for environment setup.</p><p>Create <code>CMakeLists.txt</code>.</p><div class="language-cmake"><button title="Copy Code" class="copy"></button><span class="lang">cmake</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">cmake_minimum_required</span><span style="color:#A6ACCD;">(VERSION 3.13)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">project</span><span style="color:#A6ACCD;">(emnapiexample)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">add_subdirectory</span><span style="color:#A6ACCD;">(</span><span style="color:#C3E88D;">&quot;\${CMAKE_CURRENT_SOURCE_DIR}/node_modules/emnapi&quot;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">add_executable</span><span style="color:#A6ACCD;">(hello hello.c)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">target_link_libraries</span><span style="color:#A6ACCD;">(hello emnapi)</span></span>
<span class="line"><span style="color:#89DDFF;">if</span><span style="color:#A6ACCD;">(CMAKE_SYSTEM_NAME </span><span style="color:#89DDFF;">STREQUAL</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">&quot;Emscripten&quot;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">  target_link_options(hello PRIVATE</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C3E88D;">&quot;-sEXPORTED_FUNCTIONS=[&#39;_malloc&#39;,&#39;_free&#39;]&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  )</span></span>
<span class="line"><span style="color:#89DDFF;">elseif</span><span style="color:#A6ACCD;">(CMAKE_SYSTEM_NAME </span><span style="color:#89DDFF;">STREQUAL</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">&quot;WASI&quot;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">  target_link_options(hello PRIVATE</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C3E88D;">&quot;-mexec-model=reactor&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C3E88D;">&quot;-Wl,--export=napi_register_wasm_v1&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C3E88D;">&quot;-Wl,--initial-memory=16777216,--export-dynamic,--export=malloc,--export=free,--import-undefined,--export-table&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  )</span></span>
<span class="line"><span style="color:#89DDFF;">elseif</span><span style="color:#A6ACCD;">((CMAKE_C_COMPILER_TARGET </span><span style="color:#89DDFF;">STREQUAL</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">&quot;wasm32&quot;</span><span style="color:#A6ACCD;">) </span><span style="color:#89DDFF;">OR</span><span style="color:#A6ACCD;"> (CMAKE_C_COMPILER_TARGET </span><span style="color:#89DDFF;">STREQUAL</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">&quot;wasm32-unknown-unknown&quot;</span><span style="color:#A6ACCD;">))</span></span>
<span class="line"><span style="color:#A6ACCD;">  target_link_options(hello PRIVATE</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C3E88D;">&quot;-nostdlib&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C3E88D;">&quot;-Wl,--export=napi_register_wasm_v1&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C3E88D;">&quot;-Wl,--no-entry&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#C3E88D;">&quot;-Wl,--initial-memory=16777216,--export-dynamic,--export=malloc,--export=free,--import-undefined,--export-table&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  )</span></span>
<span class="line"><span style="color:#89DDFF;">  target_link_libraries</span><span style="color:#A6ACCD;">(hello dlmalloc)</span></span>
<span class="line"><span style="color:#89DDFF;">endif</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"></span></code></pre></div><p>Building with <code>emcmake</code>, output <code>build/hello.js</code> and <code>build/hello.wasm</code>.</p><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#FFCB6B;">mkdir</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># emscripten</span></span>
<span class="line"><span style="color:#FFCB6B;">emcmake</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">cmake</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-DCMAKE_BUILD_TYPE=Release</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-G</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">Ninja</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-H.</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-Bbuild</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># wasi-sdk</span></span>
<span class="line"><span style="color:#FFCB6B;">cmake</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-DCMAKE_TOOLCHAIN_FILE=</span><span style="color:#A6ACCD;">$WASI_SDK_PATH</span><span style="color:#C3E88D;">/share/cmake/wasi-sdk.cmake</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#C3E88D;">-DWASI_SDK_PREFIX=</span><span style="color:#A6ACCD;">$WASI_SDK_PATH</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#C3E88D;">-DCMAKE_BUILD_TYPE=Release</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#C3E88D;">-G</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">Ninja</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-H.</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-Bbuild</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># wasm32</span></span>
<span class="line"><span style="color:#FFCB6B;">cmake</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-DCMAKE_TOOLCHAIN_FILE=node_modules/emnapi/cmake/wasm32.cmake</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#C3E88D;">-DLLVM_PREFIX=</span><span style="color:#A6ACCD;">$WASI_SDK_PATH</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#C3E88D;">-DCMAKE_BUILD_TYPE=Release</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#C3E88D;">-G</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">Ninja</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-H.</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-Bbuild</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">cmake</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--build</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">build</span></span>
<span class="line"></span></code></pre></div>`,6),e=[o];function t(c,r,C,A,i,D){return n(),a("div",null,e)}const E=s(p,[["render",t]]);export{_ as __pageData,E as default};
