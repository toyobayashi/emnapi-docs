import{_ as a,o as n,c as e,a as s}from"./app.ccbb5984.js";const k='{"title":"API \u5217\u8868","description":"","frontmatter":{"sidebarDepth":4},"headers":[{"level":2,"title":"\u4E0D\u53EF\u7528\u7684 API","slug":"\u4E0D\u53EF\u7528\u7684-api"},{"level":2,"title":"\u53D7\u9650\u7684 API","slug":"\u53D7\u9650\u7684-api"},{"level":3,"title":"\u5F15\u7528\u76F8\u5173","slug":"\u5F15\u7528\u76F8\u5173"},{"level":3,"title":"BigInt \u76F8\u5173","slug":"bigint-\u76F8\u5173"},{"level":3,"title":"ArrayBuffer \u76F8\u5173","slug":"arraybuffer-\u76F8\u5173"},{"level":3,"title":"Buffer \u76F8\u5173","slug":"buffer-\u76F8\u5173"},{"level":3,"title":"\u6E05\u7406\u94A9\u5B50\u76F8\u5173","slug":"\u6E05\u7406\u94A9\u5B50\u76F8\u5173"},{"level":3,"title":"\u5185\u5B58\u7BA1\u7406","slug":"\u5185\u5B58\u7BA1\u7406"},{"level":3,"title":"\u591A\u7EBF\u7A0B\u76F8\u5173","slug":"\u591A\u7EBF\u7A0B\u76F8\u5173"},{"level":3,"title":"Other API","slug":"other-api"},{"level":2,"title":"\u4EFB\u4F55\u65F6\u5019\u90FD\u53EF\u7528\u7684 API","slug":"\u4EFB\u4F55\u65F6\u5019\u90FD\u53EF\u7528\u7684-api"}],"relativePath":"zh/reference/list.md","lastUpdated":1673845773000}',t={},i=s(`<h1 id="api-\u5217\u8868" tabindex="-1">API \u5217\u8868 <a class="header-anchor" href="#api-\u5217\u8868" aria-hidden="true">#</a></h1><h2 id="\u4E0D\u53EF\u7528\u7684-api" tabindex="-1">\u4E0D\u53EF\u7528\u7684 API <a class="header-anchor" href="#\u4E0D\u53EF\u7528\u7684-api" aria-hidden="true">#</a></h2><div class="danger custom-block"><p class="custom-block-title">WARNING</p><p>\u4EE5\u4E0B API \u4E0D\u5B58\u5728\u3002</p></div><h4 id="node-api-h" tabindex="-1">node_api.h <a class="header-anchor" href="#node-api-h" aria-hidden="true">#</a></h4><ul><li><s>napi_module_register</s></li><li><s>napi_async_init</s></li><li><s>napi_async_destroy</s></li><li><s>napi_make_callback</s></li><li><s>napi_open_callback_scope</s></li><li><s>napi_close_callback_scope</s></li></ul><h2 id="\u53D7\u9650\u7684-api" tabindex="-1">\u53D7\u9650\u7684 API <a class="header-anchor" href="#\u53D7\u9650\u7684-api" aria-hidden="true">#</a></h2><h3 id="\u5F15\u7528\u76F8\u5173" tabindex="-1">\u5F15\u7528\u76F8\u5173 <a class="header-anchor" href="#\u5F15\u7528\u76F8\u5173" aria-hidden="true">#</a></h3><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>\u53EA\u6709 <code>Object</code> \u548C <code>Function</code> \u53EF\u4EE5\u88AB\u5F15\u7528\uFF0C\u4E0D\u652F\u6301 <code>Symbol</code>\u3002</p><p>\u5982\u679C\u8FD0\u884C\u65F6\u4E0D\u652F\u6301 <a href="https://www.caniuse.com/?search=FinalizationRegistry" target="_blank" rel="noopener noreferrer">FinalizationRegistry</a> \u548C <a href="https://www.caniuse.com/?search=WeakRef" target="_blank" rel="noopener noreferrer">WeakRef</a>\uFF0C\u4E0B\u9762\u7684 API \u6709\u4E00\u5B9A\u7684\u9650\u5236\uFF0C\u65E0\u8BBA\u5F15\u7528\u8BA1\u6570\u662F\u5426\u4E3A 0\uFF0C\u6240\u6709\u5F15\u7528\u90FD\u662F\u5F3A\u5F15\u7528\u3002</p></div><h4 id="js-native-api-h" tabindex="-1">js_native_api.h <a class="header-anchor" href="#js-native-api-h" aria-hidden="true">#</a></h4><ul><li><em><strong>napi_wrap</strong></em>: <code>finalize_cb</code> \u548C <code>result</code> \u5FC5\u987B\u4F20 <code>NULL</code>, \u7A0D\u540E\u5FC5\u987B\u8C03\u7528 <code>napi_remove_wrap</code></li><li><em><strong>napi_create_external</strong></em>: <code>finalize_cb</code> \u5FC5\u987B\u4F20 <code>NULL</code></li><li><em><strong>napi_create_reference</strong></em>: \u5373\u4F7F\u4F20 <code>0</code> \u7ED9 <code>initial_refcount</code> \u4E5F\u521B\u5EFA\u5F3A\u5F15\u7528</li><li><em><strong>napi_reference_unref</strong></em>: \u5373\u4F7F\u8BA1\u6570\u4E3A 0\uFF0C\u8BE5\u5F15\u7528\u4ECD\u7136\u662F\u5F3A\u5F15\u7528</li><li><em><strong>napi_add_finalizer</strong></em>: \u4E0D\u53EF\u7528\uFF0C\u603B\u662F\u629B\u51FA\u9519\u8BEF</li></ul><h3 id="bigint-\u76F8\u5173" tabindex="-1">BigInt \u76F8\u5173 <a class="header-anchor" href="#bigint-\u76F8\u5173" aria-hidden="true">#</a></h3><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>\u4EE5\u4E0B API \u9700\u8981 <a href="https://www.caniuse.com/?search=BigInt" target="_blank" rel="noopener noreferrer">BigInt</a> (v8 \u5F15\u64CE v6.7+ / Node.js v10.4.0+)\uFF0C\u5982\u679C\u8FD0\u884C\u65F6\u4E0D\u652F\u6301\uFF0C\u5219\u629B\u51FA\u9519\u8BEF\u3002</p></div><h4 id="js-native-api-h-1" tabindex="-1">js_native_api.h <a class="header-anchor" href="#js-native-api-h-1" aria-hidden="true">#</a></h4><ul><li><em><strong>napi_create_bigint_int64</strong></em></li><li><em><strong>napi_create_bigint_uint64</strong></em></li><li><em><strong>napi_create_bigint_words</strong></em></li><li><em><strong>napi_get_value_bigint_int64</strong></em></li><li><em><strong>napi_get_value_bigint_uint64</strong></em></li><li><em><strong>napi_get_value_bigint_words</strong></em></li></ul><h3 id="arraybuffer-\u76F8\u5173" tabindex="-1">ArrayBuffer \u76F8\u5173 <a class="header-anchor" href="#arraybuffer-\u76F8\u5173" aria-hidden="true">#</a></h3><table><thead><tr><th>API</th><th>\u5185\u5B58\u590D\u5236\u53D1\u751F\u7684\u6761\u4EF6</th><th><code>data</code> \u590D\u5236\u65B9\u5411</th><th><code>data</code> \u6240\u6709\u6743</th></tr></thead><tbody><tr><td><code>napi_create_arraybuffer</code></td><td>\u7528\u6237\u8BF7\u6C42\u8FD4\u56DE <code>data</code></td><td><code>\u4ECE JS \u5230 WASM</code></td><td>\u5982\u679C\u53D1\u751F\u4E86\u5185\u5B58\u590D\u5236\uFF0C\u4E14\u8FD0\u884C\u65F6\u652F\u6301 <code>FinalizationRegistry</code>\uFF0C\u5219\u7531 <code>emnapi</code> \u7BA1\u7406\uFF0C\u5426\u5219\u7528\u6237\u9700\u8981\u624B\u52A8\u91CA\u653E <code>data</code> \u5185\u5B58</td></tr><tr><td><code>napi_create_external_arraybuffer</code></td><td>\u603B\u662F\u590D\u5236</td><td><code>\u4ECE WASM \u5230 JS</code></td><td>\u7528\u6237</td></tr><tr><td><code>napi_get_arraybuffer_info</code></td><td>(\u7528\u6237\u8BF7\u6C42\u8FD4\u56DE <code>data</code>) <code>&amp;&amp;</code> (ArrayBuffer \u4E0D\u662F\u7531 emnapi \u521B\u5EFA\u7684 <code>||</code> \u7531 <code>napi_create_arraybuffer</code> \u521B\u5EFA\u4F46\u7528\u6237\u672A\u8BF7\u6C42\u8FD4\u56DE <code>data</code>)</td><td><code>\u4ECE JS \u5230 WASM</code></td><td>\u5982\u679C\u53D1\u751F\u4E86\u5185\u5B58\u590D\u5236\uFF0C\u89C4\u5219\u4E0E <code>napi_create_arraybuffer</code> \u76F8\u540C</td></tr><tr><td><code>napi_get_typedarray_info</code> <br><br> <code>napi_get_dataview_info</code> <br><br> <code>napi_get_buffer_info</code> (<code>node_api.h</code>)</td><td>(\u7528\u6237\u8BF7\u6C42\u8FD4\u56DE <code>data</code>) <code>&amp;&amp;</code> (\u4E0D\u662F wasm \u5185\u5B58\u89C6\u56FE) <code>&amp;&amp;</code> (<code>napi_get_arraybuffer_info</code> \u89C4\u5219\u540C\u6837\u9002\u7528\u4E8E\u5B83\u7684 ArrayBuffer)</td><td><code>\u4ECE JS \u5230 WASM</code></td><td>\u5982\u679C\u53D1\u751F\u4E86\u5185\u5B58\u590D\u5236\uFF0C\u89C4\u5219\u4E0E <code>napi_create_arraybuffer</code> \u76F8\u540C</td></tr><tr><td><code>napi_create_buffer</code></td><td>\u4E0D\u4F1A\u53D1\u751F\u590D\u5236\u3002\u5982\u679C\u7528\u6237\u8BF7\u6C42\u8FD4\u56DE <code>data</code>\uFF0C\u5219\u65B0\u5206\u914D\u5185\u5B58\u7136\u540E\u76F4\u63A5\u4ECE\u8FD9\u5757\u5185\u5B58\u521B\u5EFA Buffer \u89C6\u56FE\uFF0C\u5426\u5219\u7528 <code>Buffer.alloc</code> \u521B\u5EFA Buffer</td><td></td><td>\u5982\u679C\u7528\u6237\u8BF7\u6C42\u8FD4\u56DE <code>data</code>\uFF0C\u89C4\u5219\u4E0E <code>napi_create_arraybuffer</code> \u76F8\u540C</td></tr><tr><td><code>napi_create_external_buffer</code></td><td>\u4E0D\u4F1A\u53D1\u751F\u590D\u5236\u3002\u4ECE <code>data</code> \u5730\u5740\u76F4\u63A5\u521B\u5EFA Buffer \u89C6\u56FE</td><td></td><td>\u7528\u6237</td></tr></tbody></table><p>\u4F60\u53EF\u4EE5\u4F7F\u7528 <code>emnapi_sync_memory</code> \u6216\u5BFC\u51FA\u8FD0\u884C\u65F6\u65B9\u6CD5 <code>emnapiSyncMemory</code> \u6765\u540C\u6B65 wasm \u548C JS \u7684\u5185\u5B58\u3002\u5F53 wasm \u5185\u5B58\u589E\u957F\u6216\u5355\u8FB9\u5185\u5B58\u53D8\u5316\u65F6\uFF0C\u5B83\u662F\u5FC5\u8981\u7684\u3002</p><div class="language-c"><pre><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;emnapi.h&gt;</span></span>

napi_status <span class="token function">emnapi_sync_memory</span><span class="token punctuation">(</span>napi_env env<span class="token punctuation">,</span>
                               bool js_to_wasm<span class="token punctuation">,</span>
                               napi_value<span class="token operator">*</span> arraybuffer_or_view<span class="token punctuation">,</span>
                               <span class="token class-name">size_t</span> byte_offset<span class="token punctuation">,</span>
                               <span class="token class-name">size_t</span> length<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">void</span> <span class="token function">finalizer</span><span class="token punctuation">(</span>napi_env env<span class="token punctuation">,</span> <span class="token keyword">void</span><span class="token operator">*</span> finalize_data<span class="token punctuation">,</span> <span class="token keyword">void</span><span class="token operator">*</span> finalize_hint<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token function">free</span><span class="token punctuation">(</span>finalize_data<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

napi_value <span class="token function">createExternalArraybuffer</span><span class="token punctuation">(</span>napi_env env<span class="token punctuation">,</span> napi_callback_info info<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token class-name">uint8_t</span><span class="token operator">*</span> external_data <span class="token operator">=</span> <span class="token function">malloc</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  external_data<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  external_data<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
  external_data<span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
  napi_value array_buffer<span class="token punctuation">;</span>
  <span class="token function">napi_create_external_arraybuffer</span><span class="token punctuation">(</span>env<span class="token punctuation">,</span> external_data<span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> finalizer<span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>array_buffer<span class="token punctuation">)</span><span class="token punctuation">;</span>

  external_data<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span> <span class="token comment">// JavaScript ArrayBuffer \u5185\u5B58\u4E0D\u4F1A\u6539\u53D8</span>
  <span class="token function">emnapi_sync_memory</span><span class="token punctuation">(</span>env<span class="token punctuation">,</span> false<span class="token punctuation">,</span> array_buffer<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> NAPI_AUTO_LENGTH<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// \u540C\u6B65\u540E\uFF0Cnew Uint8Array(array_buffer)[0] === 3</span>

  <span class="token keyword">return</span> array_buffer<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><div class="language-js"><pre><code>declare <span class="token keyword">function</span> <span class="token function">emnapiSyncMemory</span> <span class="token punctuation">(</span>
  <span class="token parameter"><span class="token literal-property property">jsToWasm</span><span class="token operator">:</span> boolean<span class="token punctuation">,</span>
  <span class="token literal-property property">arrayBufferOrView</span><span class="token operator">:</span> ArrayBuffer <span class="token operator">|</span> ArrayBufferView<span class="token punctuation">,</span>
  byteOffset<span class="token operator">?</span><span class="token operator">:</span> number<span class="token punctuation">,</span>
  length<span class="token operator">?</span><span class="token operator">:</span> number</span>
<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span>

<span class="token keyword">const</span> array_buffer <span class="token operator">=</span> Module<span class="token punctuation">.</span>emnapiExports<span class="token punctuation">.</span><span class="token function">createExternalArraybuffer</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">new</span> <span class="token class-name">Uint8Array</span><span class="token punctuation">(</span>array_buffer<span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">===</span> <span class="token number">4</span>
Module<span class="token punctuation">.</span><span class="token function">emnapiSyncMemory</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">,</span> array_buffer<span class="token punctuation">)</span>
</code></pre></div><p>\u4F60\u53EF\u4EE5\u4F7F\u7528 <code>emnapi_get_memory_address</code> \u6216\u5BFC\u51FA\u8FD0\u884C\u65F6\u65B9\u6CD5 <code>emnapiGetMemoryAddress</code> \u6765\u68C0\u67E5\u5185\u5B58\u662F\u5426\u9700\u8981\u7531\u4F60\u6765\u624B\u52A8\u91CA\u653E\u3002</p><div class="language-c"><pre><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;emnapi.h&gt;</span></span>

<span class="token keyword">void</span><span class="token operator">*</span> data<span class="token punctuation">;</span>
<span class="token function">napi_get_typedarray_info</span><span class="token punctuation">(</span>env<span class="token punctuation">,</span> typedarray<span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>data<span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">void</span><span class="token operator">*</span> address<span class="token punctuation">;</span>
emnapi_ownership ownership<span class="token punctuation">;</span>
bool runtime_allocated<span class="token punctuation">;</span>
<span class="token function">emnapi_get_memory_address</span><span class="token punctuation">(</span>env<span class="token punctuation">,</span> typedarray<span class="token punctuation">,</span> <span class="token operator">&amp;</span>address<span class="token punctuation">,</span> <span class="token operator">&amp;</span>ownership<span class="token punctuation">,</span> <span class="token operator">&amp;</span>runtime_allocated<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">assert</span><span class="token punctuation">(</span>address <span class="token operator">==</span> data<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>data <span class="token operator">!=</span> <span class="token constant">NULL</span> <span class="token operator">&amp;&amp;</span> runtime_allocated <span class="token operator">&amp;&amp;</span> ownership <span class="token operator">==</span> emnapi_userland<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u7528\u6237\u9700\u8981\u624B\u52A8\u91CA\u653E\u5185\u5B58</span>
  <span class="token comment">// free(data);</span>
<span class="token punctuation">}</span>
</code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p><code>emnapi_get_memory_address</code> \u5BF9 wasm \u5185\u5B58\u89C6\u56FE\u53EF\u80FD\u4F1A\u8FD4\u56DE\u9519\u8BEF\u7684 <code>ownership</code> \u548C <code>runtime_allocated</code>\u3002\u6BD4\u5982\u8BF4\uFF0C\u4F60\u4F7F\u7528 <code>napi_create_arraybuffer</code> \u521B\u5EFA\u4E86\u4E00\u4E2A <code>ArrayBbuffer</code> \u5E76\u4E14\u8BF7\u6C42\u4E86\u8FD4\u56DE <code>data</code> \u5730\u5740\uFF0C\u7136\u540E\u7528 <code>napi_create_external_buffer</code> \u4ECE <code>data</code> \u521B\u5EFA\u4E86\u4E00\u4E2A\u89C6\u56FE\u3002</p></div><h3 id="buffer-\u76F8\u5173" tabindex="-1">Buffer \u76F8\u5173 <a class="header-anchor" href="#buffer-\u76F8\u5173" aria-hidden="true">#</a></h3><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>\u4EE5\u4E0B API \u9700\u8981 <code>globalThis.Buffer</code>\uFF0C\u5426\u5219\u5C06\u8FD4\u56DE <code>napi_invalid_arg</code> \u6216 <code>napi_pending_exception</code>\u3002</p><p>\u5982\u679C\u4F60\u60F3\u5728\u6D4F\u89C8\u5668\u4E2D\u4F7F\u7528\u5B83\u4EEC\uFF0C\u4F60\u53EF\u4EE5\u5F15\u5165 <a href="https://github.com/feross/buffer" target="_blank" rel="noopener noreferrer">feross/buffer</a>\u3002</p></div><ul><li><em><strong>napi_create_buffer</strong></em></li><li><em><strong>napi_create_external_buffer</strong></em></li><li><em><strong>napi_create_buffer_copy</strong></em></li><li><em><strong>napi_is_buffer</strong></em></li><li><em><strong>napi_get_buffer_info</strong></em></li></ul><h3 id="\u6E05\u7406\u94A9\u5B50\u76F8\u5173" tabindex="-1">\u6E05\u7406\u94A9\u5B50\u76F8\u5173 <a class="header-anchor" href="#\u6E05\u7406\u94A9\u5B50\u76F8\u5173" aria-hidden="true">#</a></h3><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u6E05\u7406\u94A9\u5B50\u4F1A\u88AB\u6DFB\u52A0\u5728 <code>Context</code> \u4E0A\uFF0C\u5F53 <code>Context</code> dispose \u65F6\u5B83\u4EEC\u4F1A\u88AB\u8C03\u7528\u3002</p><p>\u7279\u522B\u5730\uFF0C\u5728 Node.js \u73AF\u5883\u4E2D\uFF0C<code>Context.prototype.dispose</code> \u4F1A\u5728 process <code>beforeExit</code> \u4E8B\u4EF6\u4E2D\u81EA\u52A8\u8C03\u7528\u3002</p></div><h4 id="node-api-h-1" tabindex="-1">node_api.h <a class="header-anchor" href="#node-api-h-1" aria-hidden="true">#</a></h4><ul><li><em><strong>napi_add_env_cleanup_hook</strong></em></li><li><em><strong>napi_remove_env_cleanup_hook</strong></em></li><li><em><strong>napi_add_async_cleanup_hook</strong></em></li><li><em><strong>napi_remove_async_cleanup_hook</strong></em></li></ul><h3 id="\u5185\u5B58\u7BA1\u7406" tabindex="-1">\u5185\u5B58\u7BA1\u7406 <a class="header-anchor" href="#\u5185\u5B58\u7BA1\u7406" aria-hidden="true">#</a></h3><h4 id="js-native-api-h-2" tabindex="-1">js_native_api.h <a class="header-anchor" href="#js-native-api-h-2" aria-hidden="true">#</a></h4><ul><li><em><strong>napi_adjust_external_memory</strong></em> (\u5185\u90E8\u8C03\u7528 <code>emscripten_resize_heap</code>, <code>change_in_bytes</code> \u5FC5\u987B\u662F\u6B63\u6574\u6570)</li></ul><h3 id="\u591A\u7EBF\u7A0B\u76F8\u5173" tabindex="-1">\u591A\u7EBF\u7A0B\u76F8\u5173 <a class="header-anchor" href="#\u591A\u7EBF\u7A0B\u76F8\u5173" aria-hidden="true">#</a></h3><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>\u8FD9\u4E9B API \u9700\u8981 Emscripten pthread \u652F\u6301\uFF08<code>-sUSE_PTHREADS=1</code>\uFF09\uFF0C\u5EFA\u8BAE\u660E\u786E\u6307\u5B9A\u7EBF\u7A0B\u6C60\u5927\u5C0F\uFF08<code>-sPTHREAD_POOL_SIZE=4</code>\uFF09\u3002</p><p>\u8981\u6C42\u76EE\u6807\u73AF\u5883\u6709 <code>Worker</code> \u548C <code>SharedArrayBuffer</code> \u652F\u6301\u3002\u5982\u679C\u76EE\u6807\u73AF\u5883\u662F\u6D4F\u89C8\u5668\uFF0C\u5219\u9700\u8981</p><div class="language-"><pre><code>Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
</code></pre></div><p>\u5728\u54CD\u5E94\u5934\u4E2D\u3002</p><p><code>async_resource</code> \u548C <code>async_resource_name</code> \u53C2\u6570\u6CA1\u6709\u6548\u679C\u3002</p></div><h4 id="node-api-h-2" tabindex="-1">node_api.h <a class="header-anchor" href="#node-api-h-2" aria-hidden="true">#</a></h4><ul><li><em><strong>napi_create_async_work</strong></em></li><li><em><strong>napi_delete_async_work</strong></em></li><li><em><strong>napi_queue_async_work</strong></em></li><li><em><strong>napi_cancel_async_work</strong></em></li><li><em><strong>napi_create_threadsafe_function</strong></em></li><li><em><strong>napi_get_threadsafe_function_context</strong></em></li><li><em><strong>napi_call_threadsafe_function</strong></em></li><li><em><strong>napi_acquire_threadsafe_function</strong></em></li><li><em><strong>napi_release_threadsafe_function</strong></em></li><li><em><strong>napi_unref_threadsafe_function</strong></em></li><li><em><strong>napi_ref_threadsafe_function</strong></em></li></ul><h3 id="other-api" tabindex="-1">Other API <a class="header-anchor" href="#other-api" aria-hidden="true">#</a></h3><h4 id="node-api-h-3" tabindex="-1">node_api.h <a class="header-anchor" href="#node-api-h-3" aria-hidden="true">#</a></h4><ul><li><em><strong>napi_get_uv_event_loop</strong></em>: \u5982\u679C\u542F\u7528\u4E86 pthread\uFF0C\u5219\u8FD4\u56DE\u7EBF\u7A0B\u6C60\u76F8\u5173\u51FD\u6570\u4F7F\u7528\u7684\u5047 <code>uv_loop_t</code>\u3002</li><li><em><strong>napi_fatal_exception</strong></em>: \u5728 Node.js \u73AF\u5883\u4E2D\u8C03\u7528 <code>process._fatalException</code>\u3002\u5728\u975E Node.js \u73AF\u5883\u4E2D\u8FD4\u56DE <code>napi_generic_failure</code>\u3002</li><li><em><strong>node_api_get_module_file_name</strong></em>: \u8FD4\u56DE <code>Module.emnapiInit({ context, filename })</code> \u4F20\u5165\u7684 filename\u3002</li></ul><h2 id="\u4EFB\u4F55\u65F6\u5019\u90FD\u53EF\u7528\u7684-api" tabindex="-1">\u4EFB\u4F55\u65F6\u5019\u90FD\u53EF\u7528\u7684 API <a class="header-anchor" href="#\u4EFB\u4F55\u65F6\u5019\u90FD\u53EF\u7528\u7684-api" aria-hidden="true">#</a></h2><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>\u8BF7\u653E\u5FC3\u4F7F\u7528\u4EE5\u4E0B API\u3002</p></div><h4 id="js-native-api-h-3" tabindex="-1">js_native_api.h <a class="header-anchor" href="#js-native-api-h-3" aria-hidden="true">#</a></h4><ul><li>napi_get_last_error_info</li><li>napi_get_undefined</li><li>napi_get_null</li><li>napi_get_global</li><li>napi_get_boolean</li><li>napi_create_object</li><li>napi_create_array</li><li>napi_create_array_with_length</li><li>napi_create_double</li><li>napi_create_int32</li><li>napi_create_uint32</li><li>napi_create_int64</li><li>napi_create_string_latin1</li><li>napi_create_string_utf8</li><li>napi_create_string_utf16</li><li>napi_create_symbol</li><li><strong>node_api_symbol_for (NAPI_EXPERIMENTAL)</strong></li><li>napi_create_function</li><li>napi_create_error</li><li>napi_create_type_error</li><li>napi_create_range_error</li><li><strong>node_api_create_syntax_error (NAPI_EXPERIMENTAL)</strong></li><li>napi_typeof</li><li>napi_get_value_double</li><li>napi_get_value_int32</li><li>napi_get_value_uint32</li><li>napi_get_value_int64</li><li>napi_get_value_bool</li><li>napi_get_value_string_latin1</li><li>napi_get_value_string_utf8</li><li>napi_get_value_string_utf16</li><li>napi_coerce_to_bool</li><li>napi_coerce_to_number</li><li>napi_coerce_to_object</li><li>napi_coerce_to_string</li><li>napi_get_prototype</li><li>napi_get_property_names</li><li>napi_set_property</li><li>napi_has_property</li><li>napi_get_property</li><li>napi_delete_property</li><li>napi_has_own_property</li><li>napi_set_named_property</li><li>napi_has_named_property</li><li>napi_get_named_property</li><li>napi_set_element</li><li>napi_has_element</li><li>napi_get_element</li><li>napi_delete_element</li><li>napi_define_properties</li><li>napi_is_array</li><li>napi_get_array_length</li><li>napi_strict_equals</li><li>napi_call_function</li><li>napi_new_instance</li><li>napi_instanceof</li><li>napi_get_cb_info</li><li>napi_get_new_target</li><li>napi_define_class</li><li>napi_open_handle_scope</li><li>napi_close_handle_scope</li><li>napi_open_escapable_handle_scope</li><li>napi_close_escapable_handle_scope</li><li>napi_escape_handle</li><li>napi_throw</li><li>napi_throw_error</li><li>napi_throw_type_error</li><li>napi_throw_range_error</li><li><strong>node_api_throw_syntax_error (NAPI_EXPERIMENTAL)</strong></li><li>napi_is_error</li><li>napi_is_exception_pending</li><li>napi_get_and_clear_last_exception</li><li>napi_is_arraybuffer</li><li>napi_is_typedarray</li><li>napi_create_typedarray</li><li>napi_create_dataview</li><li>napi_is_dataview</li><li>napi_detach_arraybuffer</li><li>napi_is_detached_arraybuffer</li><li>napi_get_version</li><li>napi_create_promise</li><li>napi_resolve_deferred</li><li>napi_reject_deferred</li><li>napi_is_promise</li><li>napi_run_script</li><li>napi_create_date</li><li>napi_is_date</li><li>napi_get_date_value</li><li>napi_get_all_property_names</li><li>napi_set_instance_data</li><li>napi_get_instance_data</li><li>napi_object_freeze</li><li>napi_object_seal</li><li>napi_type_tag_object</li><li>napi_check_object_type_tag</li><li>napi_unwrap</li><li>napi_remove_wrap</li><li>napi_get_value_external</li><li>napi_delete_reference</li><li>napi_reference_ref</li><li>napi_get_reference_value</li></ul><h4 id="node-api-h-4" tabindex="-1">node_api.h <a class="header-anchor" href="#node-api-h-4" aria-hidden="true">#</a></h4><ul><li>napi_fatal_error</li><li>napi_get_node_version</li></ul>`,45),o=[i];function p(r,l,c,_,d,u){return n(),e("div",null,o)}var h=a(t,[["render",p]]);export{k as __pageData,h as default};