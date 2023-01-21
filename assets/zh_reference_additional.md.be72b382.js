import{_ as s,o as a,c as n,a as e}from"./app.96092cb2.js";const C=JSON.parse('{"title":"额外新增的 API","description":"","frontmatter":{},"headers":[],"relativePath":"zh/reference/additional.md","lastUpdated":1674282702000}'),l={name:"zh/reference/additional.md"},o=e(`<h1 id="额外新增的-api" tabindex="-1">额外新增的 API <a class="header-anchor" href="#额外新增的-api" aria-hidden="true">#</a></h1><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>以下 API 声明在 <code>emnapi.h</code> 头文件中。</p></div><h4 id="emnapi-is-support-weakref" tabindex="-1">emnapi_is_support_weakref <a class="header-anchor" href="#emnapi-is-support-weakref" aria-hidden="true">#</a></h4><div class="language-c"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">emnapi_is_support_weakref</span><span style="color:#89DDFF;">();</span></span>
<span class="line"></span></code></pre></div><p>如果运行时支持 <code>FinalizationRegistry</code> 和 <code>WeakRef</code>，则返回 <code>1</code>，否则返回 <code>0</code>。</p><h4 id="emnapi-is-support-bigint" tabindex="-1">emnapi_is_support_bigint <a class="header-anchor" href="#emnapi-is-support-bigint" aria-hidden="true">#</a></h4><div class="language-c"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">int</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">emnapi_is_support_bigint</span><span style="color:#89DDFF;">();</span></span>
<span class="line"></span></code></pre></div><p>如果运行时支持 <code>BigInt</code>，则返回 <code>1</code>，否则返回 <code>0</code>。</p><h4 id="emnapi-get-module-object" tabindex="-1">emnapi_get_module_object <a class="header-anchor" href="#emnapi-get-module-object" aria-hidden="true">#</a></h4><div class="language-c"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">napi_status </span><span style="color:#82AAFF;">emnapi_get_module_object</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">napi_env </span><span style="color:#A6ACCD;font-style:italic;">env</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                     napi_value</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">result</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span></code></pre></div><ul><li><code>[in] env</code>: The environment that the API is invoked under.</li><li><code>[out] result</code>: A <code>napi_value</code> representing the <code>Module</code> object of Emscripten.</li></ul><p>Returns <code>napi_ok</code> if the API succeeded.</p><h4 id="emnapi-get-module-property" tabindex="-1">emnapi_get_module_property <a class="header-anchor" href="#emnapi-get-module-property" aria-hidden="true">#</a></h4><div class="language-c"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">napi_status </span><span style="color:#82AAFF;">emnapi_get_module_property</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">napi_env </span><span style="color:#A6ACCD;font-style:italic;">env</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                       </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">char</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">utf8name</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                       napi_value</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">result</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span></code></pre></div><ul><li><code>[in] env</code>: The environment that the API is invoked under.</li><li><code>[in] utf8Name</code>: The name of the <code>Module</code> property to get.</li><li><code>[out] result</code>: The value of the property.</li></ul><p>Returns <code>napi_ok</code> if the API succeeded.</p><h4 id="emnapi-create-memory-view" tabindex="-1">emnapi_create_memory_view <a class="header-anchor" href="#emnapi-create-memory-view" aria-hidden="true">#</a></h4><div class="language-c"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#F78C6C;">typedef</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">enum</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_int8_array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_uint8_array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_uint8_clamped_array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_int16_array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_uint16_array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_int32_array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_uint32_array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_float32_array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_float64_array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_bigint64_array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_biguint64_array</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_data_view </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">  emnapi_buffer </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> emnapi_memory_view_type</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">napi_status </span><span style="color:#82AAFF;">emnapi_create_memory_view</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">napi_env </span><span style="color:#A6ACCD;font-style:italic;">env</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                      emnapi_memory_view_type </span><span style="color:#A6ACCD;font-style:italic;">type</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                      </span><span style="color:#C792EA;">void</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">external_data</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                      </span><span style="color:#C792EA;">size_t</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">byte_length</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                      napi_finalize </span><span style="color:#A6ACCD;font-style:italic;">finalize_cb</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                      </span><span style="color:#C792EA;">void</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">finalize_hint</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                      napi_value</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">result</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span></code></pre></div><ul><li><code>[in] env</code>: The environment that the API is invoked under.</li><li><code>[in] type</code>: The view type.</li><li><code>[in] external_data</code>: Pointer to the underlying byte buffer of the <code>ArrayBufferView</code>.</li><li><code>[in] byte_length</code>: The length in bytes of the underlying buffer.</li><li><code>[in] finalize_cb</code>: Optional callback to call when the <code>ArrayBufferView</code> is being collected.</li><li><code>[in] finalize_hint</code>: Optional hint to pass to the finalize callback during collection.</li><li><code>[out] result</code>: A <code>napi_value</code> representing a JavaScript <code>ArrayBufferView</code>.</li></ul><p>Returns <code>napi_ok</code> if the API succeeded. Returns <code>napi_generic_failure</code> if <code>FinalizationRegistry</code> or <code>WeakRef</code> is not supported.</p><p>This API returns an N-API value corresponding to a JavaScript <code>ArrayBufferView</code>. The underlying byte buffer of the <code>ArrayBufferView</code> is externally allocated and managed. The caller must ensure that the byte buffer remains valid until the finalize callback is called.</p><h4 id="emnapi-get-emscripten-version" tabindex="-1">emnapi_get_emscripten_version <a class="header-anchor" href="#emnapi-get-emscripten-version" aria-hidden="true">#</a></h4><div class="language-c"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#F78C6C;">typedef</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">struct</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">uint32_t</span><span style="color:#F07178;"> major</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">uint32_t</span><span style="color:#F07178;"> minor</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#C792EA;">uint32_t</span><span style="color:#F07178;"> patch</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> emnapi_emscripten_version</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">napi_status </span><span style="color:#82AAFF;">emnapi_get_emscripten_version</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">napi_env </span><span style="color:#A6ACCD;font-style:italic;">env</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                          </span><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> emnapi_emscripten_version</span><span style="color:#89DDFF;">**</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">version</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span></code></pre></div><ul><li><code>[in] env</code>: The environment that the API is invoked under.</li><li><code>[out] version</code>: A pointer to version information for Emscripten itself.</li></ul><p>Returns <code>napi_ok</code> if the API succeeded.</p><p>This function fills the version struct with the major, minor, and patch version of Emscripten that is used for compiling current wasm module.</p><p>The returned buffer does not need to be freed.</p><h4 id="emnapi-sync-memory" tabindex="-1">emnapi_sync_memory <a class="header-anchor" href="#emnapi-sync-memory" aria-hidden="true">#</a></h4><div class="language-c"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">napi_status </span><span style="color:#82AAFF;">emnapi_sync_memory</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">napi_env </span><span style="color:#A6ACCD;font-style:italic;">env</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                               </span><span style="color:#C792EA;">bool</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">js_to_wasm</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                               napi_value</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">arraybuffer_or_view</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                               </span><span style="color:#C792EA;">size_t</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">byte_offset</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                               </span><span style="color:#C792EA;">size_t</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">length</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span></code></pre></div><ul><li><code>[in] env</code>: The environment that the API is invoked under.</li><li><code>[in] js_to_wasm</code>: The direction of memory sync.</li><li><code>[in-out] arraybuffer_or_view</code>: The latest <code>ArrayBuffer</code> or <code>ArrayBufferView</code></li><li><code>[in] byte_offset</code></li><li><code>[in] length</code></li></ul><h4 id="emnapi-get-memory-address" tabindex="-1">emnapi_get_memory_address <a class="header-anchor" href="#emnapi-get-memory-address" aria-hidden="true">#</a></h4><div class="language-c"><button title="Copy Code" class="copy"></button><span class="lang">c</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">napi_status </span><span style="color:#82AAFF;">emnapi_get_memory_address</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">napi_env </span><span style="color:#A6ACCD;font-style:italic;">env</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                      napi_value </span><span style="color:#A6ACCD;font-style:italic;">arraybuffer_or_view</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                      </span><span style="color:#C792EA;">void</span><span style="color:#89DDFF;">**</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">address</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                      emnapi_ownership</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">ownership</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">                                      </span><span style="color:#C792EA;">bool</span><span style="color:#89DDFF;">*</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">runtime_allocated</span><span style="color:#89DDFF;">);</span></span>
<span class="line"></span></code></pre></div><ul><li><code>[in] env</code></li><li><code>[in] arraybuffer_or_view</code></li><li><code>[out] address</code></li><li><code>[out] ownership</code></li><li><code>[out] runtime_allocated</code></li></ul>`,33),p=[o];function t(c,i,r,y,d,A){return a(),n("div",null,p)}const F=s(l,[["render",t]]);export{C as __pageData,F as default};
