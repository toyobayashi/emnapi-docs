import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.21a77088.js";const d=JSON.parse('{"title":"Using CMake","description":"","frontmatter":{},"headers":[],"relativePath":"guide/using-cmake.md","filePath":"guide/using-cmake.md","lastUpdated":1706611505000}'),p={name:"guide/using-cmake.md"},o=l(`<h1 id="using-cmake" tabindex="-1">Using CMake <a class="header-anchor" href="#using-cmake" aria-label="Permalink to &quot;Using CMake&quot;">​</a></h1><p>See <a href="/emnapi-docs/guide/getting-started.html">Getting Started</a> for environment setup.</p><p>Create <code>CMakeLists.txt</code>.</p><div class="language-cmake vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">cmake</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">cmake_minimum_required</span><span style="color:#E1E4E8;">(</span><span style="color:#B392F0;">VERSION</span><span style="color:#E1E4E8;"> 3.13)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">project</span><span style="color:#E1E4E8;">(emnapiexample)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">add_subdirectory</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;\${CMAKE_CURRENT_SOURCE_DIR}/node_modules/emnapi&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">add_executable</span><span style="color:#E1E4E8;">(hello hello.c)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">target_link_libraries</span><span style="color:#E1E4E8;">(hello emnapi)</span></span>
<span class="line"><span style="color:#F97583;">if</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">CMAKE_SYSTEM_NAME</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">STREQUAL</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;Emscripten&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  target_link_options(hello </span><span style="color:#B392F0;">PRIVATE</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;-sEXPORTED_FUNCTIONS=[&#39;_napi_register_wasm_v1&#39;,&#39;_node_api_module_get_api_version_v1&#39;,&#39;_malloc&#39;,&#39;_free&#39;]&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  )</span></span>
<span class="line"><span style="color:#F97583;">elseif</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">CMAKE_SYSTEM_NAME</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">STREQUAL</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;WASI&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#F97583;">  set_target_properties</span><span style="color:#E1E4E8;">(hello PROPERTIES </span><span style="color:#B392F0;">SUFFIX</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;.wasm&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  target_link_options(hello </span><span style="color:#B392F0;">PRIVATE</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;-mexec-model=reactor&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;-Wl,--export=napi_register_wasm_v1&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;-Wl,--export-if-defined=node_api_module_get_api_version_v1&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;-Wl,--initial-memory=16777216,--export-dynamic,--export=malloc,--export=free,--import-undefined,--export-table&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  )</span></span>
<span class="line"><span style="color:#F97583;">elseif</span><span style="color:#E1E4E8;">((CMAKE_C_COMPILER_TARGET </span><span style="color:#F97583;">STREQUAL</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;wasm32&quot;</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">OR</span><span style="color:#E1E4E8;"> (CMAKE_C_COMPILER_TARGET </span><span style="color:#F97583;">STREQUAL</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;wasm32-unknown-unknown&quot;</span><span style="color:#E1E4E8;">))</span></span>
<span class="line"><span style="color:#F97583;">  set_target_properties</span><span style="color:#E1E4E8;">(hello PROPERTIES </span><span style="color:#B392F0;">SUFFIX</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;.wasm&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  target_link_options(hello </span><span style="color:#B392F0;">PRIVATE</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;-nostdlib&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;-Wl,--export=napi_register_wasm_v1&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;-Wl,--export-if-defined=node_api_module_get_api_version_v1&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;-Wl,--no-entry&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&quot;-Wl,--initial-memory=16777216,--export-dynamic,--export=malloc,--export=free,--import-undefined,--export-table&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  )</span></span>
<span class="line"><span style="color:#F97583;">  target_link_libraries</span><span style="color:#E1E4E8;">(hello dlmalloc)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;"># target_link_libraries(hello emmalloc)</span></span>
<span class="line"><span style="color:#F97583;">endif</span><span style="color:#E1E4E8;">()</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">cmake_minimum_required</span><span style="color:#24292E;">(</span><span style="color:#6F42C1;">VERSION</span><span style="color:#24292E;"> 3.13)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">project</span><span style="color:#24292E;">(emnapiexample)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">add_subdirectory</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;\${CMAKE_CURRENT_SOURCE_DIR}/node_modules/emnapi&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">add_executable</span><span style="color:#24292E;">(hello hello.c)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">target_link_libraries</span><span style="color:#24292E;">(hello emnapi)</span></span>
<span class="line"><span style="color:#D73A49;">if</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">CMAKE_SYSTEM_NAME</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">STREQUAL</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;Emscripten&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  target_link_options(hello </span><span style="color:#6F42C1;">PRIVATE</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;-sEXPORTED_FUNCTIONS=[&#39;_napi_register_wasm_v1&#39;,&#39;_node_api_module_get_api_version_v1&#39;,&#39;_malloc&#39;,&#39;_free&#39;]&quot;</span></span>
<span class="line"><span style="color:#24292E;">  )</span></span>
<span class="line"><span style="color:#D73A49;">elseif</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">CMAKE_SYSTEM_NAME</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">STREQUAL</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;WASI&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">  set_target_properties</span><span style="color:#24292E;">(hello PROPERTIES </span><span style="color:#6F42C1;">SUFFIX</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;.wasm&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  target_link_options(hello </span><span style="color:#6F42C1;">PRIVATE</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;-mexec-model=reactor&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;-Wl,--export=napi_register_wasm_v1&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;-Wl,--export-if-defined=node_api_module_get_api_version_v1&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;-Wl,--initial-memory=16777216,--export-dynamic,--export=malloc,--export=free,--import-undefined,--export-table&quot;</span></span>
<span class="line"><span style="color:#24292E;">  )</span></span>
<span class="line"><span style="color:#D73A49;">elseif</span><span style="color:#24292E;">((CMAKE_C_COMPILER_TARGET </span><span style="color:#D73A49;">STREQUAL</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;wasm32&quot;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">OR</span><span style="color:#24292E;"> (CMAKE_C_COMPILER_TARGET </span><span style="color:#D73A49;">STREQUAL</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;wasm32-unknown-unknown&quot;</span><span style="color:#24292E;">))</span></span>
<span class="line"><span style="color:#D73A49;">  set_target_properties</span><span style="color:#24292E;">(hello PROPERTIES </span><span style="color:#6F42C1;">SUFFIX</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;.wasm&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  target_link_options(hello </span><span style="color:#6F42C1;">PRIVATE</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;-nostdlib&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;-Wl,--export=napi_register_wasm_v1&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;-Wl,--export-if-defined=node_api_module_get_api_version_v1&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;-Wl,--no-entry&quot;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&quot;-Wl,--initial-memory=16777216,--export-dynamic,--export=malloc,--export=free,--import-undefined,--export-table&quot;</span></span>
<span class="line"><span style="color:#24292E;">  )</span></span>
<span class="line"><span style="color:#D73A49;">  target_link_libraries</span><span style="color:#24292E;">(hello dlmalloc)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;"># target_link_libraries(hello emmalloc)</span></span>
<span class="line"><span style="color:#D73A49;">endif</span><span style="color:#24292E;">()</span></span></code></pre></div><p>Building with <code>emcmake</code>, output <code>build/hello.js</code> and <code>build/hello.wasm</code>.</p><p>If you use node-addon-api, you can use <code>-DEMNAPI_FIND_NODE_ADDON_API=ON</code> or manually add node-addon-api directory to the include dir via <code>include_directories()</code> or <code>target_include_directories()</code>.</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">mkdir</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># emscripten</span></span>
<span class="line"><span style="color:#B392F0;">emcmake</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">cmake</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-DCMAKE_BUILD_TYPE=Release</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#79B8FF;">-DEMNAPI_FIND_NODE_ADDON_API=ON</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">              </span><span style="color:#79B8FF;">-G</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">Ninja</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-H.</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-Bbuild</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># wasi-sdk</span></span>
<span class="line"><span style="color:#B392F0;">cmake</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-DCMAKE_TOOLCHAIN_FILE=</span><span style="color:#E1E4E8;">$WASI_SDK_PATH</span><span style="color:#79B8FF;">/share/cmake/wasi-sdk.cmake</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">-DWASI_SDK_PREFIX=</span><span style="color:#E1E4E8;">$WASI_SDK_PATH</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">-DEMNAPI_FIND_NODE_ADDON_API=ON</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">-DCMAKE_BUILD_TYPE=Release</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">-G</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">Ninja</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-H.</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-Bbuild</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># wasm32</span></span>
<span class="line"><span style="color:#B392F0;">cmake</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-DCMAKE_TOOLCHAIN_FILE=node_modules/emnapi/cmake/wasm32.cmake</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">-DLLVM_PREFIX=</span><span style="color:#E1E4E8;">$WASI_SDK_PATH</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">-DCMAKE_BUILD_TYPE=Release</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#79B8FF;">-G</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">Ninja</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-H.</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-Bbuild</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">cmake</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">--build</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">build</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">mkdir</span><span style="color:#24292E;"> </span><span style="color:#032F62;">build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># emscripten</span></span>
<span class="line"><span style="color:#6F42C1;">emcmake</span><span style="color:#24292E;"> </span><span style="color:#032F62;">cmake</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-DCMAKE_BUILD_TYPE=Release</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#005CC5;">-DEMNAPI_FIND_NODE_ADDON_API=ON</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">              </span><span style="color:#005CC5;">-G</span><span style="color:#24292E;"> </span><span style="color:#032F62;">Ninja</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-H.</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-Bbuild</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># wasi-sdk</span></span>
<span class="line"><span style="color:#6F42C1;">cmake</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-DCMAKE_TOOLCHAIN_FILE=</span><span style="color:#24292E;">$WASI_SDK_PATH</span><span style="color:#005CC5;">/share/cmake/wasi-sdk.cmake</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">-DWASI_SDK_PREFIX=</span><span style="color:#24292E;">$WASI_SDK_PATH</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">-DEMNAPI_FIND_NODE_ADDON_API=ON</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">-DCMAKE_BUILD_TYPE=Release</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">-G</span><span style="color:#24292E;"> </span><span style="color:#032F62;">Ninja</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-H.</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-Bbuild</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># wasm32</span></span>
<span class="line"><span style="color:#6F42C1;">cmake</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-DCMAKE_TOOLCHAIN_FILE=node_modules/emnapi/cmake/wasm32.cmake</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">-DLLVM_PREFIX=</span><span style="color:#24292E;">$WASI_SDK_PATH</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">-DCMAKE_BUILD_TYPE=Release</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#005CC5;">-G</span><span style="color:#24292E;"> </span><span style="color:#032F62;">Ninja</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-H.</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-Bbuild</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">cmake</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">--build</span><span style="color:#24292E;"> </span><span style="color:#032F62;">build</span></span></code></pre></div>`,7),e=[o];function t(c,r,E,y,i,_){return n(),a("div",null,e)}const u=s(p,[["render",t]]);export{d as __pageData,u as default};
