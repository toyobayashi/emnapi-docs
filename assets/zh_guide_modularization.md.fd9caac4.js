import{_ as n,o as s,c as a,a as p}from"./app.ccbb5984.js";const f='{"title":"\u6A21\u5757\u5316","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u8BBE\u7F6E MODULARIZE","slug":"\u8BBE\u7F6E-modularize"}],"relativePath":"zh/guide/modularization.md","lastUpdated":1673845773000}',t={},o=p(`<h1 id="\u6A21\u5757\u5316" tabindex="-1">\u6A21\u5757\u5316 <a class="header-anchor" href="#\u6A21\u5757\u5316" aria-hidden="true">#</a></h1><p>\u9ED8\u8BA4\u60C5\u51B5\u4E0B\uFF0CEmscripten \u4EE5\u76F4\u63A5\u7684\u65B9\u5F0F\u5C06\u6240\u6709\u4EE3\u7801\u53D1\u9001\u5230\u8F93\u51FA\u5230 .js \u6587\u4EF6\u4E2D\u3002\u8FD9\u610F\u5473\u7740\u5982\u679C\u5728\u7F51\u9875\u7684\u811A\u672C\u6807\u7B7E\u4E2D\u52A0\u8F7D\u5B83\uFF0C\u5B83\u5C06\u4F7F\u7528\u5168\u5C40\u8303\u56F4\u3002</p><div class="language-js"><pre><code><span class="token comment">// \u8F93\u51FA\u7684 js</span>

<span class="token keyword">var</span> Module <span class="token operator">=</span> <span class="token keyword">typeof</span> Module <span class="token operator">!==</span> <span class="token string">&quot;undefined&quot;</span> <span class="token operator">?</span> Module <span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// var ...</span>

<span class="token keyword">function</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter">args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span>

<span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><h2 id="\u8BBE\u7F6E-modularize" tabindex="-1">\u8BBE\u7F6E <code>MODULARIZE</code> <a class="header-anchor" href="#\u8BBE\u7F6E-modularize" aria-hidden="true">#</a></h2><p>\u4F60\u53EF\u4EE5\u8BBE\u7F6E <code>-sMODULARIZE</code> \u548C <code>-sEXPORT_NAME=createModule</code> \u6765\u544A\u8BC9 Emscripten \u8F93\u51FA UMD \u6A21\u5757\uFF0C\u4EE3\u7801\u5305\u88C5\u5728\u8FD4\u56DE Promise \u7684\u5DE5\u5382\u51FD\u6570\u4E2D\u3002</p><div class="language-js"><pre><code><span class="token keyword">var</span> createModule <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> _scriptDir <span class="token operator">=</span> <span class="token keyword">typeof</span> document <span class="token operator">!==</span> <span class="token string">&#39;undefined&#39;</span> <span class="token operator">&amp;&amp;</span> document<span class="token punctuation">.</span>currentScript <span class="token operator">?</span> document<span class="token punctuation">.</span>currentScript<span class="token punctuation">.</span>src <span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> __filename <span class="token operator">!==</span> <span class="token string">&#39;undefined&#39;</span><span class="token punctuation">)</span> _scriptDir <span class="token operator">=</span> _scriptDir <span class="token operator">||</span> __filename<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
<span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">createModule</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  createModule <span class="token operator">=</span> createModule <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> Module <span class="token operator">=</span> <span class="token keyword">typeof</span> createModule <span class="token operator">!==</span> <span class="token string">&quot;undefined&quot;</span> <span class="token operator">?</span> createModule <span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// ...</span>

Module<span class="token punctuation">[</span><span class="token string">&quot;ready&quot;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  readyPromiseResolve <span class="token operator">=</span> resolve<span class="token punctuation">;</span>
  readyPromiseReject <span class="token operator">=</span> reject<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter">args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span>

<span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> createModule<span class="token punctuation">.</span>ready<span class="token punctuation">;</span>

<span class="token punctuation">}</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> exports <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> module <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span><span class="token punctuation">)</span>
  module<span class="token punctuation">.</span>exports <span class="token operator">=</span> createModule<span class="token punctuation">;</span>
<span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> define <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span> <span class="token operator">&amp;&amp;</span> define<span class="token punctuation">[</span><span class="token string">&#39;amd&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
  <span class="token function">define</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> createModule<span class="token punctuation">;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> exports <span class="token operator">===</span> <span class="token string">&#39;object&#39;</span><span class="token punctuation">)</span>
  exports<span class="token punctuation">[</span><span class="token string">&quot;createModule&quot;</span><span class="token punctuation">]</span> <span class="token operator">=</span> createModule<span class="token punctuation">;</span>
</code></pre></div><p>\u8FD4\u56DE\u7684 Promise \u5728 wasm \u7F16\u8BD1\u5B8C\u6210\u65F6\u6210\u529F\u89E3\u6790 Module \u5BF9\u8C61\uFF0C\u7C7B\u4F3C\u4E8E <code>onRuntimeInitialized</code> \u56DE\u8C03\u3002\u4F7F\u7528 <code>-sMODULARIZE</code> \u65F6\u4E0D\u9700\u8981\u4F7F\u7528 <code>onRuntimeInitialized</code> \u56DE\u8C03\u3002</p><p>\u5DE5\u5382\u51FD\u6570\u63A5\u53D7 1 \u4E2A\u53C2\u6570\uFF0C\u4E00\u4E2A\u5177\u6709 Module \u9ED8\u8BA4\u503C\u7684\u5BF9\u8C61\uFF1A</p><div class="language-js"><pre><code><span class="token function">createModule</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// Emscripten module init options</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">Module</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> binding <span class="token operator">=</span> Module<span class="token punctuation">.</span><span class="token function">emnapiInit</span><span class="token punctuation">(</span><span class="token punctuation">{</span> context <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token comment">// or</span>

<span class="token keyword">const</span> Module <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">createModule</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// Emscripten module init options</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> binding <span class="token operator">=</span> Module<span class="token punctuation">.</span><span class="token function">emnapiInit</span><span class="token punctuation">(</span><span class="token punctuation">{</span> context <span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div>`,9),e=[o];function c(u,l,k,r,i,d){return s(),a("div",null,e)}var y=n(t,[["render",c]]);export{f as __pageData,y as default};
