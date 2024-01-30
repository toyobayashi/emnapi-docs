import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.21a77088.js";const u=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh/guide/using-node-gyp.md","filePath":"zh/guide/using-node-gyp.md","lastUpdated":1706535803000}'),p={name:"zh/guide/using-node-gyp.md"},o=l(`<h3 id="using-node-gyp-experimental" tabindex="-1">Using node-gyp (Experimental) <a class="header-anchor" href="#using-node-gyp-experimental" aria-label="Permalink to &quot;Using node-gyp (Experimental)&quot;">​</a></h3><p>目前 node-gyp 仅适用于Linux，并且不支持在交叉编译时链接静态库。已经有 PR 试图让 node-gyp 正常工作。</p><ul><li><a href="https://github.com/nodejs/gyp-next/pull/222" target="_blank" rel="noreferrer">https://github.com/nodejs/gyp-next/pull/222</a></li><li><a href="https://github.com/nodejs/node-gyp/pull/2974" target="_blank" rel="noreferrer">https://github.com/nodejs/node-gyp/pull/2974</a></li></ul><p>如果你在 Windows 或 macOS 上遇到问题，请查看上面的 PR 了解上游变更细节以及查看 <a href="https://github.com/toyobayashi/emnapi-node-gyp-test" target="_blank" rel="noreferrer">emnapi-node-gyp-test</a> 了解示例用法。</p><ul><li>变量</li></ul><p>Arch: <code>node-gyp configure --arch=&lt;wasm32 | wasm64&gt;</code></p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// node-gyp configure -- -Dvariable_name=value</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">declare</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">OS</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;emscripten&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;wasi&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;unknown&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * Enable async work and threadsafe-functions</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#F97583;">@default</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">0</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#F97583;">declare</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> wasm_threads</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/** </span><span style="color:#F97583;">@default</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">1048576</span><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#F97583;">declare</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> stack_size</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/** </span><span style="color:#F97583;">@default</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">16777216</span><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#F97583;">declare</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> initial_memory</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/** </span><span style="color:#F97583;">@default</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">2147483648</span><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#F97583;">declare</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> max_memory</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/** </span><span style="color:#F97583;">@default</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">path.join(path.dirname(commonGypiPath,&#39;./dist/library_napi.js&#39;))</span><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#F97583;">declare</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> emnapi_js_library</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/** </span><span style="color:#F97583;">@default</span><span style="color:#6A737D;"> </span><span style="color:#E1E4E8;">0</span><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#F97583;">declare</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> emnapi_manual_linking</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// node-gyp configure -- -Dvariable_name=value</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">declare</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">OS</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;emscripten&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;wasi&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;unknown&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;"> * Enable async work and threadsafe-functions</span></span>
<span class="line"><span style="color:#6A737D;"> * </span><span style="color:#D73A49;">@default</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">0</span></span>
<span class="line"><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">declare</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> wasm_threads</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/** </span><span style="color:#D73A49;">@default</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">1048576</span><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">declare</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> stack_size</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/** </span><span style="color:#D73A49;">@default</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">16777216</span><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">declare</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> initial_memory</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/** </span><span style="color:#D73A49;">@default</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">2147483648</span><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">declare</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> max_memory</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/** </span><span style="color:#D73A49;">@default</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">path.join(path.dirname(commonGypiPath,&#39;./dist/library_napi.js&#39;))</span><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">declare</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> emnapi_js_library</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/** </span><span style="color:#D73A49;">@default</span><span style="color:#6A737D;"> </span><span style="color:#24292E;">0</span><span style="color:#6A737D;"> */</span></span>
<span class="line"><span style="color:#D73A49;">declare</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> emnapi_manual_linking</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span></span></code></pre></div><ul><li>创建 <code>binding.gyp</code></li></ul><div class="language-py vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">py</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;targets&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">    {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;target_name&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;hello&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;sources&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#9ECBFF;">&quot;hello.c&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">      ],</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#9ECBFF;">&quot;conditions&quot;</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">        [</span><span style="color:#9ECBFF;">&quot;OS == &#39;emscripten&#39;&quot;</span><span style="color:#E1E4E8;">, {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#9ECBFF;">&quot;product_extension&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;js&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;"># required</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;"># Windows and Linux</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#9ECBFF;">&quot;cflags&quot;</span><span style="color:#E1E4E8;">: [],</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#9ECBFF;">&quot;cflags_c&quot;</span><span style="color:#E1E4E8;">: [],</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#9ECBFF;">&quot;cflags_cc&quot;</span><span style="color:#E1E4E8;">: [],</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#9ECBFF;">&quot;ldflags&quot;</span><span style="color:#E1E4E8;">: [],</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;"># macOS uses following config</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#9ECBFF;">&#39;xcode_settings&#39;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#9ECBFF;">&quot;WARNING_CFLAGS&quot;</span><span style="color:#E1E4E8;">: [], </span><span style="color:#6A737D;"># cflags</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#9ECBFF;">&quot;OTHER_CFLAGS&quot;</span><span style="color:#E1E4E8;">: [], </span><span style="color:#6A737D;"># cflags_c</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#9ECBFF;">&quot;OTHER_CPLUSPLUSFLAGS&quot;</span><span style="color:#E1E4E8;">: [], </span><span style="color:#6A737D;"># cflags_cc</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#9ECBFF;">&quot;OTHER_LDFLAGS&quot;</span><span style="color:#E1E4E8;">: [] </span><span style="color:#6A737D;"># ldflags</span></span>
<span class="line"><span style="color:#E1E4E8;">          }</span></span>
<span class="line"><span style="color:#E1E4E8;">        }],</span></span>
<span class="line"><span style="color:#E1E4E8;">        [</span><span style="color:#9ECBFF;">&quot;OS == &#39;wasi&#39;&quot;</span><span style="color:#E1E4E8;">, {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;"># ...</span></span>
<span class="line"><span style="color:#E1E4E8;">        }],</span></span>
<span class="line"><span style="color:#E1E4E8;">        [</span><span style="color:#9ECBFF;">&quot;OS == &#39;unknown&#39; or OS == &#39;&#39;&quot;</span><span style="color:#E1E4E8;">, {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;"># ...</span></span>
<span class="line"><span style="color:#E1E4E8;">        }]</span></span>
<span class="line"><span style="color:#E1E4E8;">      ]</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  ]</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;targets&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">    {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;target_name&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;hello&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;sources&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&quot;hello.c&quot;</span></span>
<span class="line"><span style="color:#24292E;">      ],</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#032F62;">&quot;conditions&quot;</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">        [</span><span style="color:#032F62;">&quot;OS == &#39;emscripten&#39;&quot;</span><span style="color:#24292E;">, {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#032F62;">&quot;product_extension&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;js&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;"># required</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;"># Windows and Linux</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#032F62;">&quot;cflags&quot;</span><span style="color:#24292E;">: [],</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#032F62;">&quot;cflags_c&quot;</span><span style="color:#24292E;">: [],</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#032F62;">&quot;cflags_cc&quot;</span><span style="color:#24292E;">: [],</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#032F62;">&quot;ldflags&quot;</span><span style="color:#24292E;">: [],</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;"># macOS uses following config</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#032F62;">&#39;xcode_settings&#39;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#032F62;">&quot;WARNING_CFLAGS&quot;</span><span style="color:#24292E;">: [], </span><span style="color:#6A737D;"># cflags</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#032F62;">&quot;OTHER_CFLAGS&quot;</span><span style="color:#24292E;">: [], </span><span style="color:#6A737D;"># cflags_c</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#032F62;">&quot;OTHER_CPLUSPLUSFLAGS&quot;</span><span style="color:#24292E;">: [], </span><span style="color:#6A737D;"># cflags_cc</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#032F62;">&quot;OTHER_LDFLAGS&quot;</span><span style="color:#24292E;">: [] </span><span style="color:#6A737D;"># ldflags</span></span>
<span class="line"><span style="color:#24292E;">          }</span></span>
<span class="line"><span style="color:#24292E;">        }],</span></span>
<span class="line"><span style="color:#24292E;">        [</span><span style="color:#032F62;">&quot;OS == &#39;wasi&#39;&quot;</span><span style="color:#24292E;">, {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;"># ...</span></span>
<span class="line"><span style="color:#24292E;">        }],</span></span>
<span class="line"><span style="color:#24292E;">        [</span><span style="color:#032F62;">&quot;OS == &#39;unknown&#39; or OS == &#39;&#39;&quot;</span><span style="color:#24292E;">, {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6A737D;"># ...</span></span>
<span class="line"><span style="color:#24292E;">        }]</span></span>
<span class="line"><span style="color:#24292E;">      ]</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  ]</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><ul><li>添加以下环境变量</li></ul><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># Linux or macOS</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> GYP_CROSSCOMPILE</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># emscripten</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> AR_target</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">$EMSDK</span><span style="color:#9ECBFF;">/upstream/emscripten/emar&quot;</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> CC_target</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">$EMSDK</span><span style="color:#9ECBFF;">/upstream/emscripten/emcc&quot;</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> CXX_target</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">$EMSDK</span><span style="color:#9ECBFF;">/upstream/emscripten/em++&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># wasi-sdk</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> AR_target</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">$WASI_SDK_PATH</span><span style="color:#9ECBFF;">/bin/ar&quot;</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> CC_target</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">$WASI_SDK_PATH</span><span style="color:#9ECBFF;">/bin/clang&quot;</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> CXX_target</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">$WASI_SDK_PATH</span><span style="color:#9ECBFF;">/bin/clang++&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># Linux or macOS</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> GYP_CROSSCOMPILE</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># emscripten</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> AR_target</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">$EMSDK</span><span style="color:#032F62;">/upstream/emscripten/emar&quot;</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> CC_target</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">$EMSDK</span><span style="color:#032F62;">/upstream/emscripten/emcc&quot;</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> CXX_target</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">$EMSDK</span><span style="color:#032F62;">/upstream/emscripten/em++&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># wasi-sdk</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> AR_target</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">$WASI_SDK_PATH</span><span style="color:#032F62;">/bin/ar&quot;</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> CC_target</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">$WASI_SDK_PATH</span><span style="color:#032F62;">/bin/clang&quot;</span></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> CXX_target</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;</span><span style="color:#24292E;">$WASI_SDK_PATH</span><span style="color:#032F62;">/bin/clang++&quot;</span></span></code></pre></div><div class="language-bat vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bat</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">@</span><span style="color:#F97583;">REM</span><span style="color:#6A737D;"> Windows</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">set</span><span style="color:#E1E4E8;"> GYP_CROSSCOMPILE</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">@</span><span style="color:#F97583;">REM</span><span style="color:#6A737D;"> emscripten</span></span>
<span class="line"><span style="color:#F97583;">call</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">set</span><span style="color:#E1E4E8;"> AR_target</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">EMSDK:\\=/</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">/upstream/emscripten/emar.bat</span></span>
<span class="line"><span style="color:#F97583;">call</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">set</span><span style="color:#E1E4E8;"> CC_target</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">EMSDK:\\=/</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">/upstream/emscripten/emcc.bat</span></span>
<span class="line"><span style="color:#F97583;">call</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">set</span><span style="color:#E1E4E8;"> CXX_target</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">EMSDK:\\=/</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">/upstream/emscripten/em++.bat</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">@</span><span style="color:#F97583;">REM</span><span style="color:#6A737D;"> wasi-sdk</span></span>
<span class="line"><span style="color:#F97583;">call</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">set</span><span style="color:#E1E4E8;"> AR_target</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">WASI_SDK_PATH:\\=/</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">/bin/ar.exe</span></span>
<span class="line"><span style="color:#F97583;">call</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">set</span><span style="color:#E1E4E8;"> CC_target</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">WASI_SDK_PATH:\\=/</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">/bin/clang.exe</span></span>
<span class="line"><span style="color:#F97583;">call</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">set</span><span style="color:#E1E4E8;"> CXX_target</span><span style="color:#F97583;">=</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">WASI_SDK_PATH:\\=/</span><span style="color:#79B8FF;">%%</span><span style="color:#E1E4E8;">/bin/clang++.exe</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">@</span><span style="color:#D73A49;">REM</span><span style="color:#6A737D;"> Windows</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">set</span><span style="color:#24292E;"> GYP_CROSSCOMPILE</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">@</span><span style="color:#D73A49;">REM</span><span style="color:#6A737D;"> emscripten</span></span>
<span class="line"><span style="color:#D73A49;">call</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">set</span><span style="color:#24292E;"> AR_target</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">EMSDK:\\=/</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">/upstream/emscripten/emar.bat</span></span>
<span class="line"><span style="color:#D73A49;">call</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">set</span><span style="color:#24292E;"> CC_target</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">EMSDK:\\=/</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">/upstream/emscripten/emcc.bat</span></span>
<span class="line"><span style="color:#D73A49;">call</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">set</span><span style="color:#24292E;"> CXX_target</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">EMSDK:\\=/</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">/upstream/emscripten/em++.bat</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">@</span><span style="color:#D73A49;">REM</span><span style="color:#6A737D;"> wasi-sdk</span></span>
<span class="line"><span style="color:#D73A49;">call</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">set</span><span style="color:#24292E;"> AR_target</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">WASI_SDK_PATH:\\=/</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">/bin/ar.exe</span></span>
<span class="line"><span style="color:#D73A49;">call</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">set</span><span style="color:#24292E;"> CC_target</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">WASI_SDK_PATH:\\=/</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">/bin/clang.exe</span></span>
<span class="line"><span style="color:#D73A49;">call</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">set</span><span style="color:#24292E;"> CXX_target</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">WASI_SDK_PATH:\\=/</span><span style="color:#005CC5;">%%</span><span style="color:#24292E;">/bin/clang++.exe</span></span></code></pre></div><ul><li>构建</li></ul><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># Linux or macOS</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># emscripten</span></span>
<span class="line"><span style="color:#B392F0;">emmake</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">node-gyp</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">rebuild</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">--arch=wasm32</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">--nodedir=./node_modules/emnapi</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">--</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-f</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">make</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-DOS=emscripten</span><span style="color:#E1E4E8;"> </span><span style="color:#6A737D;"># -Dwasm_threads=1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># wasi</span></span>
<span class="line"><span style="color:#B392F0;">node-gyp</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">rebuild</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">--arch=wasm32</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">--nodedir=./node_modules/emnapi</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">--</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-f</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">make</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-DOS=wasi</span><span style="color:#E1E4E8;"> </span><span style="color:#6A737D;"># -Dwasm_threads=1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># bare wasm32</span></span>
<span class="line"><span style="color:#B392F0;">node-gyp</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">rebuild</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">--arch=wasm32</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">--nodedir=./node_modules/emnapi</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">--</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-f</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">make</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-DOS=unknown</span><span style="color:#E1E4E8;"> </span><span style="color:#6A737D;"># -Dwasm_threads=1</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># Linux or macOS</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># emscripten</span></span>
<span class="line"><span style="color:#6F42C1;">emmake</span><span style="color:#24292E;"> </span><span style="color:#032F62;">node-gyp</span><span style="color:#24292E;"> </span><span style="color:#032F62;">rebuild</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">--arch=wasm32</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">--nodedir=./node_modules/emnapi</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">--</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-f</span><span style="color:#24292E;"> </span><span style="color:#032F62;">make</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-DOS=emscripten</span><span style="color:#24292E;"> </span><span style="color:#6A737D;"># -Dwasm_threads=1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># wasi</span></span>
<span class="line"><span style="color:#6F42C1;">node-gyp</span><span style="color:#24292E;"> </span><span style="color:#032F62;">rebuild</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">--arch=wasm32</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">--nodedir=./node_modules/emnapi</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">--</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-f</span><span style="color:#24292E;"> </span><span style="color:#032F62;">make</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-DOS=wasi</span><span style="color:#24292E;"> </span><span style="color:#6A737D;"># -Dwasm_threads=1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># bare wasm32</span></span>
<span class="line"><span style="color:#6F42C1;">node-gyp</span><span style="color:#24292E;"> </span><span style="color:#032F62;">rebuild</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">--arch=wasm32</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">--nodedir=./node_modules/emnapi</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">--</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-f</span><span style="color:#24292E;"> </span><span style="color:#032F62;">make</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-DOS=unknown</span><span style="color:#24292E;"> </span><span style="color:#6A737D;"># -Dwasm_threads=1</span></span></code></pre></div><div class="language-bat vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bat</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">@</span><span style="color:#F97583;">REM</span><span style="color:#6A737D;"> Use make generator on Windows</span></span>
<span class="line"><span style="color:#F97583;">@</span><span style="color:#F97583;">REM</span><span style="color:#6A737D;"> Run the bat file in POSIX-like environment (e.g. Cygwin)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">@</span><span style="color:#F97583;">REM</span><span style="color:#6A737D;"> emscripten</span></span>
<span class="line"><span style="color:#F97583;">call</span><span style="color:#E1E4E8;"> npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make -DOS=emscripten</span></span>
<span class="line"><span style="color:#F97583;">call</span><span style="color:#E1E4E8;"> emmake.bat make -C </span><span style="color:#FFAB70;">%~dp0</span><span style="color:#E1E4E8;">build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">@</span><span style="color:#F97583;">REM</span><span style="color:#6A737D;"> wasi</span></span>
<span class="line"><span style="color:#F97583;">call</span><span style="color:#E1E4E8;"> npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make -DOS=wasi</span></span>
<span class="line"><span style="color:#E1E4E8;">make -C </span><span style="color:#FFAB70;">%~dp0</span><span style="color:#E1E4E8;">build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">@</span><span style="color:#F97583;">REM</span><span style="color:#6A737D;"> bare wasm32</span></span>
<span class="line"><span style="color:#F97583;">call</span><span style="color:#E1E4E8;"> npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make -DOS=unknown</span></span>
<span class="line"><span style="color:#E1E4E8;">make -C </span><span style="color:#FFAB70;">%~dp0</span><span style="color:#E1E4E8;">build</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">@</span><span style="color:#D73A49;">REM</span><span style="color:#6A737D;"> Use make generator on Windows</span></span>
<span class="line"><span style="color:#D73A49;">@</span><span style="color:#D73A49;">REM</span><span style="color:#6A737D;"> Run the bat file in POSIX-like environment (e.g. Cygwin)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">@</span><span style="color:#D73A49;">REM</span><span style="color:#6A737D;"> emscripten</span></span>
<span class="line"><span style="color:#D73A49;">call</span><span style="color:#24292E;"> npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make -DOS=emscripten</span></span>
<span class="line"><span style="color:#D73A49;">call</span><span style="color:#24292E;"> emmake.bat make -C </span><span style="color:#E36209;">%~dp0</span><span style="color:#24292E;">build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">@</span><span style="color:#D73A49;">REM</span><span style="color:#6A737D;"> wasi</span></span>
<span class="line"><span style="color:#D73A49;">call</span><span style="color:#24292E;"> npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make -DOS=wasi</span></span>
<span class="line"><span style="color:#24292E;">make -C </span><span style="color:#E36209;">%~dp0</span><span style="color:#24292E;">build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">@</span><span style="color:#D73A49;">REM</span><span style="color:#6A737D;"> bare wasm32</span></span>
<span class="line"><span style="color:#D73A49;">call</span><span style="color:#24292E;"> npx.cmd node-gyp configure --arch=wasm32 --nodedir=./node_modules/emnapi -- -f make -DOS=unknown</span></span>
<span class="line"><span style="color:#24292E;">make -C </span><span style="color:#E36209;">%~dp0</span><span style="color:#24292E;">build</span></span></code></pre></div>`,15),e=[o];function c(t,r,y,E,i,F){return n(),a("div",null,e)}const A=s(p,[["render",c]]);export{u as __pageData,A as default};
