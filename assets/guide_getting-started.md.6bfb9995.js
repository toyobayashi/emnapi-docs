import{_ as n,c as s,o as a,a as t}from"./app.aefd0482.js";const h='{"title":"Getting Started","description":"","frontmatter":{},"headers":[{"level":2,"title":"Environment Requires","slug":"environment-requires"},{"level":2,"title":"Installation","slug":"installation"},{"level":3,"title":"Install via NPM","slug":"install-via-npm"},{"level":3,"title":"Install via CMake","slug":"install-via-cmake"},{"level":2,"title":"Writing Source Code","slug":"writing-source-code"},{"level":2,"title":"Buiding Source Code","slug":"buiding-source-code"},{"level":2,"title":"Running on Browser","slug":"running-on-browser"},{"level":2,"title":"Running on Node.js","slug":"running-on-node-js"}],"relativePath":"guide/getting-started.md","lastUpdated":1658419677000}',e={},o=t(`<h1 id="getting-started" tabindex="-1">Getting Started <a class="header-anchor" href="#getting-started" aria-hidden="true">#</a></h1><p>This section will help you build a Hello World example by using emnapi.</p><h2 id="environment-requires" tabindex="-1">Environment Requires <a class="header-anchor" href="#environment-requires" aria-hidden="true">#</a></h2><p>You will need to install:</p><ul><li>Node.js <code>&gt;= v14.6.0</code></li><li>Emscripten <code>&gt;= v3.0.0</code> (<code>v2.x</code> may also works, not tested)</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Set <code>$EMSDK</code> environment variable to the emsdk root path.</p><p>Add <code>$EMSDK/upstream/emscripten</code> to <code>$PATH</code> environment variable.</p></div><p>Verify your environment:</p><div class="language-bash"><pre><code><span class="token function">node</span> -v
<span class="token function">npm</span> -v
emcc -v
</code></pre></div><h2 id="installation" tabindex="-1">Installation <a class="header-anchor" href="#installation" aria-hidden="true">#</a></h2><p>There are two methods to install emnapi.</p><ul><li>Install <code>emnapi</code> package to local project via <code>npm</code> (recommended)</li><li>Build <code>emnapi</code> from source via <code>cmake</code> and install to custom sysroot path</li></ul><h3 id="install-via-npm" tabindex="-1">Install via NPM <a class="header-anchor" href="#install-via-npm" aria-hidden="true">#</a></h3><div class="language-bash"><pre><code><span class="token function">npm</span> <span class="token function">install</span> -D @tybys/emnapi

<span class="token comment"># optional, see &quot;emnapi Runtime&quot; chapter for more details</span>
<span class="token comment"># npm install -D @tybys/emnapi-runtime</span>
</code></pre></div><h3 id="install-via-cmake" tabindex="-1">Install via CMake <a class="header-anchor" href="#install-via-cmake" aria-hidden="true">#</a></h3><p>You will need to install:</p><ul><li>CMake <code>&gt;= 3.13</code></li><li>make</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>There are several choices to get <code>make</code> for Windows user</p><ul><li>Install <a href="https://www.mingw-w64.org/downloads/" target="_blank" rel="noopener noreferrer">mingw-w64</a>, then use <code>mingw32-make</code></li><li>Download <a href="https://github.com/toyobayashi/make-win-build/releases" target="_blank" rel="noopener noreferrer">MSVC prebuilt binary of GNU make</a>, add to <code>%Path%</code> then rename it to <code>mingw32-make</code></li><li>Install <a href="https://visualstudio.microsoft.com/" target="_blank" rel="noopener noreferrer">Visual Studio 2022</a> C++ desktop workload, use <code>nmake</code> in <code>Visual Studio Developer Command Prompt</code></li><li>Install <a href="https://visualstudio.microsoft.com/visual-cpp-build-tools/" target="_blank" rel="noopener noreferrer">Visual C++ Build Tools</a>, use <code>nmake</code> in <code>Visual Studio Developer Command Prompt</code></li></ul></div><p>Verify your environment:</p><div class="language-bash"><pre><code>cmake --version
<span class="token function">make</span> -v

<span class="token comment"># Windows cmd</span>
<span class="token comment"># mingw32-make -v</span>

<span class="token comment"># Visual Studio Developer Command Prompt</span>
<span class="token comment"># nmake /?</span>
</code></pre></div><p>Clone repository and build from source:</p><div class="language-bash"><pre><code><span class="token function">git</span> clone https://github.com/toyobayashi/emnapi
<span class="token builtin class-name">cd</span> ./emnapi

<span class="token function">npm</span> run build

<span class="token builtin class-name">cd</span> ./packages/emnapi

emcmake cmake -DCMAKE_BUILD_TYPE<span class="token operator">=</span>Release -H. -Bbuild

<span class="token comment"># Windows have mingw32-make installed</span>
<span class="token comment"># emcmake cmake -DCMAKE_BUILD_TYPE=Release -G &quot;MinGW Makefiles&quot; -H. -Bbuild</span>

<span class="token comment"># Windows Visual Studio Developer Command Prompt</span>
<span class="token comment"># emcmake cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_MAKE_PROGRAM=nmake -G &quot;NMake Makefiles&quot;  -H. -Bbuild</span>

cmake --build build
cmake --install build <span class="token punctuation">[</span>--prefix <span class="token operator">&lt;</span>sysroot<span class="token operator">&gt;</span><span class="token punctuation">]</span>
</code></pre></div><p>Default <code>sysroot</code> is <code>$EMSDK/upstream/emscripten/cache/sysroot</code>.</p><h2 id="writing-source-code" tabindex="-1">Writing Source Code <a class="header-anchor" href="#writing-source-code" aria-hidden="true">#</a></h2><p>Create <code>hello.c</code></p><div class="language-c"><pre><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;node_api.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;string.h&gt;</span></span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name function">NAPI_CALL</span><span class="token expression"><span class="token punctuation">(</span>env<span class="token punctuation">,</span> the_call<span class="token punctuation">)</span>                                </span><span class="token punctuation">\\</span>
  <span class="token expression"><span class="token keyword">do</span> <span class="token punctuation">{</span>                                                          </span><span class="token punctuation">\\</span>
    <span class="token expression"><span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>the_call<span class="token punctuation">)</span> <span class="token operator">!=</span> napi_ok<span class="token punctuation">)</span> <span class="token punctuation">{</span>                                </span><span class="token punctuation">\\</span>
      <span class="token expression"><span class="token keyword">const</span> napi_extended_error_info <span class="token operator">*</span>error_info<span class="token punctuation">;</span>               </span><span class="token punctuation">\\</span>
      <span class="token expression"><span class="token function">napi_get_last_error_info</span><span class="token punctuation">(</span><span class="token punctuation">(</span>env<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>error_info<span class="token punctuation">)</span><span class="token punctuation">;</span>             </span><span class="token punctuation">\\</span>
      <span class="token expression">bool is_pending<span class="token punctuation">;</span>                                          </span><span class="token punctuation">\\</span>
      <span class="token expression"><span class="token keyword">const</span> <span class="token keyword">char</span><span class="token operator">*</span> err_message <span class="token operator">=</span> error_info<span class="token operator">-&gt;</span>error_message<span class="token punctuation">;</span>      </span><span class="token punctuation">\\</span>
      <span class="token expression"><span class="token function">napi_is_exception_pending</span><span class="token punctuation">(</span><span class="token punctuation">(</span>env<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>is_pending<span class="token punctuation">)</span><span class="token punctuation">;</span>            </span><span class="token punctuation">\\</span>
      <span class="token expression"><span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>is_pending<span class="token punctuation">)</span> <span class="token punctuation">{</span>                                        </span><span class="token punctuation">\\</span>
        <span class="token expression"><span class="token keyword">const</span> <span class="token keyword">char</span><span class="token operator">*</span> error_message <span class="token operator">=</span> err_message <span class="token operator">!=</span> <span class="token constant">NULL</span> <span class="token operator">?</span>       </span><span class="token punctuation">\\</span>
          <span class="token expression">err_message <span class="token operator">:</span>                                         </span><span class="token punctuation">\\</span>
          <span class="token string">&quot;empty error message&quot;</span><span class="token expression"><span class="token punctuation">;</span>                                </span><span class="token punctuation">\\</span>
        <span class="token expression"><span class="token function">napi_throw_error</span><span class="token punctuation">(</span><span class="token punctuation">(</span>env<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">,</span> error_message<span class="token punctuation">)</span><span class="token punctuation">;</span>           </span><span class="token punctuation">\\</span>
      <span class="token expression"><span class="token punctuation">}</span>                                                         </span><span class="token punctuation">\\</span>
      <span class="token expression"><span class="token keyword">return</span> <span class="token constant">NULL</span><span class="token punctuation">;</span>                                              </span><span class="token punctuation">\\</span>
    <span class="token expression"><span class="token punctuation">}</span>                                                           </span><span class="token punctuation">\\</span>
  <span class="token expression"><span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span></span></span>

<span class="token keyword">static</span> napi_value <span class="token function">js_hello</span><span class="token punctuation">(</span>napi_env env<span class="token punctuation">,</span> napi_callback_info info<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  napi_value world<span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token keyword">char</span><span class="token operator">*</span> str <span class="token operator">=</span> <span class="token string">&quot;world&quot;</span><span class="token punctuation">;</span>
  <span class="token class-name">size_t</span> str_len <span class="token operator">=</span> <span class="token function">strlen</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">NAPI_CALL</span><span class="token punctuation">(</span>env<span class="token punctuation">,</span> <span class="token function">napi_create_string_utf8</span><span class="token punctuation">(</span>env<span class="token punctuation">,</span> str<span class="token punctuation">,</span> str_len<span class="token punctuation">,</span> <span class="token operator">&amp;</span>world<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> world<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">NAPI_MODULE_INIT</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  napi_value hello<span class="token punctuation">;</span>
  <span class="token function">NAPI_CALL</span><span class="token punctuation">(</span>env<span class="token punctuation">,</span> <span class="token function">napi_create_function</span><span class="token punctuation">(</span>env<span class="token punctuation">,</span> <span class="token string">&quot;hello&quot;</span><span class="token punctuation">,</span> NAPI_AUTO_LENGTH<span class="token punctuation">,</span>
                                      js_hello<span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>hello<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">NAPI_CALL</span><span class="token punctuation">(</span>env<span class="token punctuation">,</span> <span class="token function">napi_set_named_property</span><span class="token punctuation">(</span>env<span class="token punctuation">,</span> exports<span class="token punctuation">,</span> <span class="token string">&quot;hello&quot;</span><span class="token punctuation">,</span> hello<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> exports<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>The C code is equivalant to the JavaScript below:</p><div class="language-js"><pre><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">exports</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token function-variable function">hello</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token function">hello</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// native code in js_hello</span>
    <span class="token keyword">const</span> world <span class="token operator">=</span> <span class="token string">&#39;world&#39;</span>
    <span class="token keyword">return</span> world
  <span class="token punctuation">}</span>

  exports<span class="token punctuation">.</span>hello <span class="token operator">=</span> hello
  <span class="token keyword">return</span> exports
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>module<span class="token punctuation">.</span>exports<span class="token punctuation">)</span>
</code></pre></div><h2 id="buiding-source-code" tabindex="-1">Buiding Source Code <a class="header-anchor" href="#buiding-source-code" aria-hidden="true">#</a></h2><p>Compile <code>hello.c</code> using <code>emcc</code>, set include directory by <code>-I</code>, export <code>_malloc</code> and <code>_free</code>, link emnapi JavaScript library by <code>--js-library</code>.</p><div class="language-bash"><pre><code>emcc -O3 <span class="token punctuation">\\</span>
     -I./node_modules/@tybys/emnapi/include <span class="token punctuation">\\</span>
     --js-library<span class="token operator">=</span>./node_modules/@tybys/emnapi/dist/library_napi.js <span class="token punctuation">\\</span>
     -sEXPORTED_FUNCTIONS<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string">&#39;_malloc&#39;</span>,<span class="token string">&#39;_free&#39;</span><span class="token punctuation">]</span> <span class="token punctuation">\\</span>
     -o hello.js <span class="token punctuation">\\</span>
     ./node_modules/@tybys/emnapi/src/emnapi.c <span class="token punctuation">\\</span>
     hello.c
</code></pre></div><p>If you installed <code>emnapi</code> via <code>cmake --install</code>, run:</p><div class="language-bash"><pre><code>emcc -O3 <span class="token punctuation">\\</span>
     -I<span class="token operator">&lt;</span>sysroot<span class="token operator">&gt;</span>/include/emnapi <span class="token punctuation">\\</span>
     -L<span class="token operator">&lt;</span>sysroot<span class="token operator">&gt;</span>/lib/emnapi <span class="token punctuation">\\</span>
     --js-library<span class="token operator">=</span><span class="token operator">&lt;</span>sysroot<span class="token operator">&gt;</span>/lib/emnapi/library_napi.js <span class="token punctuation">\\</span>
     -sEXPORTED_FUNCTIONS<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string">&#39;_malloc&#39;</span>,<span class="token string">&#39;_free&#39;</span><span class="token punctuation">]</span> <span class="token punctuation">\\</span>
     -o hello.js <span class="token punctuation">\\</span>
     -lemnapi <span class="token punctuation">\\</span>
     hello.c
</code></pre></div><p>If you have the environment setting ok, this step will output <code>hello.js</code> and <code>hello.wasm</code>.</p><h2 id="running-on-browser" tabindex="-1">Running on Browser <a class="header-anchor" href="#running-on-browser" aria-hidden="true">#</a></h2><p>Create <code>index.html</code>, use the output js file. The default export key is <code>emnapiExports</code> on <a href="https://emscripten.org/docs/api_reference/module.html" target="_blank" rel="noopener noreferrer">Module</a> object. You can change the key by predefining <code>NODE_GYP_MODULE_NAME</code>. <code>onEmnapiInitialized</code> will be called before <code>onRuntimeInitialized</code>.</p><div class="language-html"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>hello.js<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token comment">// Emscripten js glue code will create a global \`Module\` object</span>
Module<span class="token punctuation">.</span><span class="token function-variable function">onEmnapiInitialized</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> emnapiExports</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// error handling</span>
    <span class="token comment">// emnapiExports === undefined</span>
    <span class="token comment">// Module[NODE_GYP_MODULE_NAME] === undefined</span>
    console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// emnapiExports === Module[NODE_GYP_MODULE_NAME]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

Module<span class="token punctuation">.</span><span class="token function-variable function">onRuntimeInitialized</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span><span class="token string">&#39;emnapiExports&#39;</span> <span class="token keyword">in</span> Module<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> binding <span class="token operator">=</span> Module<span class="token punctuation">.</span>emnapiExports<span class="token punctuation">;</span>
  <span class="token keyword">var</span> msg <span class="token operator">=</span> <span class="token string">&#39;hello &#39;</span> <span class="token operator">+</span> binding<span class="token punctuation">.</span><span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  window<span class="token punctuation">.</span><span class="token function">alert</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre></div><p>If you are using <code>Visual Studio Code</code> and have <code>Live Server</code> extension installed, you can right click the HTML file in Visual Studio Code source tree and click <code>Open With Live Server</code>, then you can see the hello world alert!</p><h2 id="running-on-node-js" tabindex="-1">Running on Node.js <a class="header-anchor" href="#running-on-node-js" aria-hidden="true">#</a></h2><p>Create <code>index.js</code>.</p><div class="language-js"><pre><code><span class="token keyword">const</span> Module <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./hello.js&#39;</span><span class="token punctuation">)</span>

Module<span class="token punctuation">.</span><span class="token function-variable function">onEmnapiInitialized</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> emnapiExports</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...</span>
<span class="token punctuation">}</span>

Module<span class="token punctuation">.</span><span class="token function-variable function">onRuntimeInitialized</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span><span class="token string">&#39;emnapiExports&#39;</span> <span class="token keyword">in</span> Module<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span>
  <span class="token keyword">const</span> binding <span class="token operator">=</span> Module<span class="token punctuation">.</span>emnapiExports
  <span class="token keyword">const</span> msg <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">hello </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>binding<span class="token punctuation">.</span><span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre></div><p>Run the script.</p><div class="language-bash"><pre><code><span class="token function">node</span> ./index.js
</code></pre></div><p>Then you can see the hello world output.</p><p>If a JS error is thrown on runtime initialization, Node.js process will exit. You can use <code>-sNODEJS_CATCH_EXIT=0</code> and add <code>ununcaughtException</code> handler yourself to avoid this. Alternatively, you can use <code>Module.onEmnapiInitialized</code> callback to catch error.</p>`,44),p=[o];function c(l,i,u,r,k,d){return a(),s("div",null,p)}var g=n(e,[["render",c]]);export{h as __pageData,g as default};