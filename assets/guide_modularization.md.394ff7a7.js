import{_ as n,o as s,c as a,a as t}from"./app.ccbb5984.js";const f='{"title":"Modularization","description":"","frontmatter":{},"headers":[{"level":2,"title":"Using MODULARIZE Setting","slug":"using-modularize-setting"}],"relativePath":"guide/modularization.md","lastUpdated":1673845773000}',p={},o=t(`<h1 id="modularization" tabindex="-1">Modularization <a class="header-anchor" href="#modularization" aria-hidden="true">#</a></h1><p>By default Emscripten emit all code in a straightforward way into the output .js file. That means that if you load that in a script tag in a web page, it will use the global scope.</p><div class="language-js"><pre><code><span class="token comment">// the output js</span>

<span class="token keyword">var</span> Module <span class="token operator">=</span> <span class="token keyword">typeof</span> Module <span class="token operator">!==</span> <span class="token string">&quot;undefined&quot;</span> <span class="token operator">?</span> Module <span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// var ...</span>

<span class="token keyword">function</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter">args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span>

<span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><h2 id="using-modularize-setting" tabindex="-1">Using <code>MODULARIZE</code> Setting <a class="header-anchor" href="#using-modularize-setting" aria-hidden="true">#</a></h2><p>You can set <code>-sMODULARIZE</code> and <code>-sEXPORT_NAME=createModule</code> to tell Emscripten to emit UMD module, the code is wrapped in the exported factory function that returns a promise.</p><div class="language-js"><pre><code><span class="token keyword">var</span> createModule <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
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
</code></pre></div><p>The returned promise is resolved with the module instance when it is safe to run the compiled code, similar to the <code>onRuntimeInitialized</code> callback. You do not need to use the <code>onRuntimeInitialized</code> callback when using <code>-sMODULARIZE</code>.</p><p>The factory function accepts 1 parameter, an object with default values for the module instance:</p><div class="language-js"><pre><code><span class="token function">createModule</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// Emscripten module init options</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">Module</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> binding <span class="token operator">=</span> Module<span class="token punctuation">.</span><span class="token function">emnapiInit</span><span class="token punctuation">(</span><span class="token punctuation">{</span> context <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token comment">// or</span>

<span class="token keyword">const</span> Module <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">createModule</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// Emscripten module init options</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> binding <span class="token operator">=</span> Module<span class="token punctuation">.</span><span class="token function">emnapiInit</span><span class="token punctuation">(</span><span class="token punctuation">{</span> context <span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div>`,9),e=[o];function c(u,l,i,r,k,d){return s(),a("div",null,e)}var y=n(p,[["render",c]]);export{f as __pageData,y as default};
