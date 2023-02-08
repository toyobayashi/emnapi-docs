import{_ as s,o as n,c as a,a as l}from"./app.58384371.js";const F=JSON.parse('{"title":"Using C++ Wrapper","description":"","frontmatter":{},"headers":[],"relativePath":"guide/using-cpp.md","lastUpdated":1675863400000}'),p={name:"guide/using-cpp.md"},o=l(`<h1 id="using-c-wrapper" tabindex="-1">Using C++ Wrapper <a class="header-anchor" href="#using-c-wrapper" aria-hidden="true">#</a></h1><p>Alternatively, you can also use <a href="https://github.com/nodejs/node-addon-api" target="_blank" rel="noreferrer">node-addon-api</a> which is official Node-API header-only C++ wrapper, already shipped (<a href="https://github.com/nodejs/node-addon-api/releases/tag/v5.1.0" target="_blank" rel="noreferrer">v5.1.0</a>) in <code>emnapi</code> but without Node.js specific API such as <code>CallbackScope</code>.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>C++ wrapper can only be used to target Node.js v14.6.0+ and modern browsers those support <code>FinalizationRegistry</code> and <code>WeakRef</code> (<a href="https://v8.dev/blog/v8-release-84" target="_blank" rel="noreferrer">v8 engine v8.4+</a>)!</p></div><p>Create <code>hello.cpp</code>.</p><div class="language-cpp"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">#include</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#C3E88D;">napi.h</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">Napi</span><span style="color:#89DDFF;">::</span><span style="color:#FFCB6B;">String</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">JsHello</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Napi</span><span style="color:#89DDFF;">::</span><span style="color:#FFCB6B;">CallbackInfo</span><span style="color:#C792EA;">&amp;</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">info</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#FFCB6B;">Napi</span><span style="color:#89DDFF;">::</span><span style="color:#A6ACCD;">Env env </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> info</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Env</span><span style="color:#89DDFF;">();</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Napi</span><span style="color:#89DDFF;">::</span><span style="color:#FFCB6B;">String</span><span style="color:#89DDFF;">::</span><span style="color:#82AAFF;">New</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">env</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">world</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">Napi</span><span style="color:#89DDFF;">::</span><span style="color:#FFCB6B;">Object</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Init</span><span style="color:#89DDFF;">(</span><span style="color:#FFCB6B;">Napi</span><span style="color:#89DDFF;">::</span><span style="color:#FFCB6B;">Env</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">env</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Napi</span><span style="color:#89DDFF;">::</span><span style="color:#FFCB6B;">Object</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">exports</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  exports</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">Set</span><span style="color:#89DDFF;">(</span><span style="color:#FFCB6B;">Napi</span><span style="color:#89DDFF;">::</span><span style="color:#FFCB6B;">String</span><span style="color:#89DDFF;">::</span><span style="color:#82AAFF;">New</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">env</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">hello</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">),</span></span>
<span class="line"><span style="color:#A6ACCD;">              </span><span style="color:#FFCB6B;">Napi</span><span style="color:#89DDFF;">::</span><span style="color:#FFCB6B;">Function</span><span style="color:#89DDFF;">::</span><span style="color:#82AAFF;">New</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">env</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> JsHello</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">hello</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">)).</span><span style="color:#82AAFF;">Check</span><span style="color:#89DDFF;">();</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> exports</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">NODE_API_MODULE</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">NODE_GYP_MODULE_NAME</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> Init</span><span style="color:#89DDFF;">)</span></span>
<span class="line"></span></code></pre></div><p>Compile <code>hello.cpp</code> using <code>em++</code>. C++ exception is disabled by Emscripten default, and not supported by wasi-sdk, so predefine <code>-DNAPI_DISABLE_CPP_EXCEPTIONS</code> and <code>-DNODE_ADDON_API_ENABLE_MAYBE</code> here. If you would like to enable C++ exception, use <code>-sDISABLE_EXCEPTION_CATCHING=0</code> instead and remove <code>.Check()</code> call. See official documentation <a href="https://github.com/nodejs/node-addon-api/blob/main/doc/error_handling.md" target="_blank" rel="noreferrer">here</a>.</p><div class="vp-code-group"><div class="tabs"><input type="radio" name="group-ijMS8" id="tab-LZ6dpln" checked="checked"><label for="tab-LZ6dpln">emscripten</label><input type="radio" name="group-ijMS8" id="tab-yotuTKr"><label for="tab-yotuTKr">wasi-sdk</label><input type="radio" name="group-ijMS8" id="tab-B7LgXRd"><label for="tab-B7LgXRd">clang</label></div><div class="blocks"><div class="language-bash active"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#FFCB6B;">em++</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-O3</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">     </span><span style="color:#C3E88D;">-DNAPI_DISABLE_CPP_EXCEPTIONS</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">     </span><span style="color:#C3E88D;">-DNODE_ADDON_API_ENABLE_MAYBE</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">     </span><span style="color:#C3E88D;">-I./node_modules/@tybys/emnapi/include</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">     </span><span style="color:#C3E88D;">-L./node_modules/@tybys/emnapi/lib/wasm32-emscripten</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">     </span><span style="color:#C3E88D;">--js-library=./node_modules/@tybys/emnapi/dist/library_napi.js</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">     </span><span style="color:#C3E88D;">-sEXPORTED_FUNCTIONS=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">[&#39;_malloc&#39;,&#39;_free&#39;]</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">     </span><span style="color:#C3E88D;">-o</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">hello.js</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">     </span><span style="color:#C3E88D;">hello.cpp</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">     </span><span style="color:#C3E88D;">-lemnapi</span></span>
<span class="line"></span></code></pre></div><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#FFCB6B;">clang++</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-O3</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-DNAPI_DISABLE_CPP_EXCEPTIONS</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-DNODE_ADDON_API_ENABLE_MAYBE</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-I./node_modules/@tybys/emnapi/include</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-L./node_modules/@tybys/emnapi/lib/wasm32-wasi</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">--target=wasm32-wasi</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">--sysroot=</span><span style="color:#A6ACCD;">$WASI_SDK_PATH</span><span style="color:#C3E88D;">/share/wasi-sysroot</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-mexec-model=reactor</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--initial-memory=16777216</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--export-dynamic</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--export=malloc</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--export=free</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--export=napi_register_wasm_v1</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--import-undefined</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--export-table</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-o</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">hello.wasm</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">hello.cpp</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-lemnapi</span></span>
<span class="line"></span></code></pre></div><div class="language-bash"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;"># \`node-addon-api\` is using the C++ standard libraries,</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># so you must use WASI if you are using \`node-addon-api\`.</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># You can still use \`wasm32-unknown-unknown\` target</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># if you use Node-API C API only in C++.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFCB6B;">clang++</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-O3</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-I./node_modules/@tybys/emnapi/include</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-L./node_modules/@tybys/emnapi/lib/wasm32</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">--target=wasm32</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-nostdlib</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--no-entry</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--initial-memory=16777216</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--export-dynamic</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--export=malloc</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--export=free</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--export=napi_register_wasm_v1</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--import-undefined</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-Wl,--export-table</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-o</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">node_api_c_api_only.wasm</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">node_api_c_api_only.cpp</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-lemnapi</span><span style="color:#A6ACCD;"> \\</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#C3E88D;">-ldlmalloc</span></span>
<span class="line"></span></code></pre></div></div></div><p>You should provide <code>operator new</code> and <code>operator delete</code> definition when targeting <code>wasm32-unknown-unknown</code></p><div class="language-cpp"><button title="Copy Code" class="copy"></button><span class="lang">cpp</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">#include</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#C3E88D;">stddef.h</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">extern</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">C</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">void</span><span style="color:#89DDFF;">*</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">malloc</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">size_t</span><span style="color:#F07178;"> size</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#C792EA;">extern</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">C</span><span style="color:#89DDFF;">&quot;</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">void</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">free</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">void</span><span style="color:#89DDFF;">*</span><span style="color:#F07178;"> p</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">void*</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">operator</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">new</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">size_t</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">size</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">malloc</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">size</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">void</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">operator</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">delete</span><span style="color:#89DDFF;">(</span><span style="color:#C792EA;">void*</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">p</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">noexcept</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">free</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">p</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,9),e=[o];function t(c,r,C,y,D,A){return n(),a("div",null,e)}const d=s(p,[["render",t]]);export{F as __pageData,d as default};
