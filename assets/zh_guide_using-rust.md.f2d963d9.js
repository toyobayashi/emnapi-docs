import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.c6d1d410.js";const q=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh/guide/using-rust.md","filePath":"zh/guide/using-rust.md","lastUpdated":1698230210000}'),p={name:"zh/guide/using-rust.md"},o=l(`<p>目前你可以像这样使用 <a href="https://github.com/napi-rs/napi-rs" target="_blank" rel="noreferrer">napi-rs</a>，更多支持工作正在进行中。</p><p>注意：WASI 构建目标需要使用 rust nightly toolchain。</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-NhgEQ" id="tab-v3gp2oT" checked="checked"><label for="tab-v3gp2oT">Cargo.toml</label><input type="radio" name="group-NhgEQ" id="tab-dpB3X_7"><label for="tab-dpB3X_7">.cargo/config.toml</label><input type="radio" name="group-NhgEQ" id="tab-cpQ67wn"><label for="tab-cpQ67wn">src/main.rs</label><input type="radio" name="group-NhgEQ" id="tab-sbauUBy"><label for="tab-sbauUBy">index.js</label></div><div class="blocks"><div class="language-toml vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">package</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">edition = </span><span style="color:#9ECBFF;">&quot;2021&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">name = </span><span style="color:#9ECBFF;">&quot;binding&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">version = </span><span style="color:#9ECBFF;">&quot;0.0.0&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># We should build binary for WASI reactor</span></span>
<span class="line"><span style="color:#6A737D;"># https://github.com/rust-lang/rust/pull/79997</span></span>
<span class="line"><span style="color:#6A737D;"># https://github.com/WebAssembly/WASI/issues/24</span></span>
<span class="line"><span style="color:#6A737D;"># for wasm</span></span>
<span class="line"><span style="color:#E1E4E8;">[[</span><span style="color:#B392F0;">bin</span><span style="color:#E1E4E8;">]]</span></span>
<span class="line"><span style="color:#E1E4E8;">name = </span><span style="color:#9ECBFF;">&quot;binding&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">path = </span><span style="color:#9ECBFF;">&quot;src/main.rs&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># for native</span></span>
<span class="line"><span style="color:#6A737D;"># [lib]</span></span>
<span class="line"><span style="color:#6A737D;"># name = &quot;binding&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># path = &quot;src/lib.rs&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># crate-type = [&quot;cdylib&quot;]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">dependencies</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">napi = { version = </span><span style="color:#9ECBFF;">&quot;2.12.1&quot;</span><span style="color:#E1E4E8;">, default-features = </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">, features = [</span><span style="color:#9ECBFF;">&quot;napi8&quot;</span><span style="color:#E1E4E8;">] }</span></span>
<span class="line"><span style="color:#E1E4E8;">napi-sys = { version = </span><span style="color:#9ECBFF;">&quot;2.2.3&quot;</span><span style="color:#E1E4E8;">, features = [</span><span style="color:#9ECBFF;">&quot;napi8&quot;</span><span style="color:#E1E4E8;">] }</span></span>
<span class="line"><span style="color:#E1E4E8;">napi-derive = </span><span style="color:#9ECBFF;">&quot;2.12.2&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">build-dependencies</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">napi-build = </span><span style="color:#9ECBFF;">&quot;2.0.1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">profile</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">release</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">strip = </span><span style="color:#9ECBFF;">&quot;symbols&quot;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">package</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">edition = </span><span style="color:#032F62;">&quot;2021&quot;</span></span>
<span class="line"><span style="color:#24292E;">name = </span><span style="color:#032F62;">&quot;binding&quot;</span></span>
<span class="line"><span style="color:#24292E;">version = </span><span style="color:#032F62;">&quot;0.0.0&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># We should build binary for WASI reactor</span></span>
<span class="line"><span style="color:#6A737D;"># https://github.com/rust-lang/rust/pull/79997</span></span>
<span class="line"><span style="color:#6A737D;"># https://github.com/WebAssembly/WASI/issues/24</span></span>
<span class="line"><span style="color:#6A737D;"># for wasm</span></span>
<span class="line"><span style="color:#24292E;">[[</span><span style="color:#6F42C1;">bin</span><span style="color:#24292E;">]]</span></span>
<span class="line"><span style="color:#24292E;">name = </span><span style="color:#032F62;">&quot;binding&quot;</span></span>
<span class="line"><span style="color:#24292E;">path = </span><span style="color:#032F62;">&quot;src/main.rs&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;"># for native</span></span>
<span class="line"><span style="color:#6A737D;"># [lib]</span></span>
<span class="line"><span style="color:#6A737D;"># name = &quot;binding&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># path = &quot;src/lib.rs&quot;</span></span>
<span class="line"><span style="color:#6A737D;"># crate-type = [&quot;cdylib&quot;]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">dependencies</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">napi = { version = </span><span style="color:#032F62;">&quot;2.12.1&quot;</span><span style="color:#24292E;">, default-features = </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">, features = [</span><span style="color:#032F62;">&quot;napi8&quot;</span><span style="color:#24292E;">] }</span></span>
<span class="line"><span style="color:#24292E;">napi-sys = { version = </span><span style="color:#032F62;">&quot;2.2.3&quot;</span><span style="color:#24292E;">, features = [</span><span style="color:#032F62;">&quot;napi8&quot;</span><span style="color:#24292E;">] }</span></span>
<span class="line"><span style="color:#24292E;">napi-derive = </span><span style="color:#032F62;">&quot;2.12.2&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">build-dependencies</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">napi-build = </span><span style="color:#032F62;">&quot;2.0.1&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">profile</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">release</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">strip = </span><span style="color:#032F62;">&quot;symbols&quot;</span></span></code></pre></div><div class="language-toml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">build</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">target = [</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;wasm32-unknown-unknown&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;wasm32-wasi&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">target</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">wasm32-unknown-unknown</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">rustflags = [</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-L./node_modules/emnapi/lib/wasm32&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-lemnapi&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-ldlmalloc&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;"># &quot;-lemmalloc&quot;,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--no-entry&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--initial-memory=16777216&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--export-dynamic&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--export=malloc&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--export=free&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--export=napi_register_wasm_v1&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--export-table&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--import-undefined&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">[</span><span style="color:#B392F0;">target</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">wasm32-wasi</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">rustflags = [</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-L./node_modules/emnapi/lib/wasm32-wasi&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-lemnapi&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--initial-memory=16777216&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--export-dynamic&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--export=malloc&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--export=free&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--export=napi_register_wasm_v1&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--export-table&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-C&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;link-arg=--import-undefined&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;-Z&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;wasi-exec-model=reactor&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;"># +nightly</span></span>
<span class="line"><span style="color:#E1E4E8;">]</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">build</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">target = [</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;wasm32-unknown-unknown&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;wasm32-wasi&quot;</span></span>
<span class="line"><span style="color:#24292E;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">target</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">wasm32-unknown-unknown</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">rustflags = [</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-L./node_modules/emnapi/lib/wasm32&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-lemnapi&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-ldlmalloc&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;"># &quot;-lemmalloc&quot;,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--no-entry&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--initial-memory=16777216&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--export-dynamic&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--export=malloc&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--export=free&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--export=napi_register_wasm_v1&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--export-table&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--import-undefined&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">[</span><span style="color:#6F42C1;">target</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">wasm32-wasi</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">rustflags = [</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-L./node_modules/emnapi/lib/wasm32-wasi&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-lemnapi&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--initial-memory=16777216&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--export-dynamic&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--export=malloc&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--export=free&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--export=napi_register_wasm_v1&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--export-table&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-C&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;link-arg=--import-undefined&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;-Z&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;wasi-exec-model=reactor&quot;</span><span style="color:#24292E;">, </span><span style="color:#6A737D;"># +nightly</span></span>
<span class="line"><span style="color:#24292E;">]</span></span></code></pre></div><div class="language-rust vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">rust</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">#</span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">[no_main]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">use</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">napi_derive</span><span style="color:#F97583;">::</span><span style="color:#E1E4E8;">napi;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">#[napi]</span></span>
<span class="line"><span style="color:#F97583;">fn</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">fibonacci</span><span style="color:#E1E4E8;">(n</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">u32</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">-&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">u32</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">match</span><span style="color:#E1E4E8;"> n {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    _ </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">fibonacci</span><span style="color:#E1E4E8;">(n </span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">fibonacci</span><span style="color:#E1E4E8;">(n </span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">),</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">#</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">[no_main]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">use</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">napi_derive</span><span style="color:#D73A49;">::</span><span style="color:#24292E;">napi;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">#[napi]</span></span>
<span class="line"><span style="color:#D73A49;">fn</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fibonacci</span><span style="color:#24292E;">(n</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">u32</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">-&gt;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">u32</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">match</span><span style="color:#24292E;"> n {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">1</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    _ </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fibonacci</span><span style="color:#24292E;">(n </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">fibonacci</span><span style="color:#24292E;">(n </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">2</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">fs</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">require</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;fs&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">path</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">require</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;path&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">useWASI</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> wasi</span></span>
<span class="line"><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (useWASI) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> { </span><span style="color:#79B8FF;">WASI</span><span style="color:#E1E4E8;"> } </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">require</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;wasi&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  wasi </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">WASI</span><span style="color:#E1E4E8;">({ </span><span style="color:#6A737D;">/* ... */</span><span style="color:#E1E4E8;"> })</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> { </span><span style="color:#79B8FF;">instantiateNapiModule</span><span style="color:#E1E4E8;"> } </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">require</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;@emnapi/core&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">wasmBuffer</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> useWASI</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> fs.</span><span style="color:#B392F0;">readFileSync</span><span style="color:#E1E4E8;">(path.</span><span style="color:#B392F0;">join</span><span style="color:#E1E4E8;">(__dirname, </span><span style="color:#9ECBFF;">&#39;./target/wasm32-wasi/release/binding.wasm&#39;</span><span style="color:#E1E4E8;">))</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> fs.</span><span style="color:#B392F0;">readFileSync</span><span style="color:#E1E4E8;">(path.</span><span style="color:#B392F0;">join</span><span style="color:#E1E4E8;">(__dirname, </span><span style="color:#9ECBFF;">&#39;./target/wasm32-unknown-unknown/release/binding.wasm&#39;</span><span style="color:#E1E4E8;">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">instantiateNapiModule</span><span style="color:#E1E4E8;">(wasmBuffer, {</span></span>
<span class="line"><span style="color:#E1E4E8;">  context: </span><span style="color:#B392F0;">require</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;@emnapi/runtime&#39;</span><span style="color:#E1E4E8;">).</span><span style="color:#B392F0;">getDefaultContext</span><span style="color:#E1E4E8;">(),</span></span>
<span class="line"><span style="color:#E1E4E8;">  wasi,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">beforeInit</span><span style="color:#E1E4E8;"> ({ </span><span style="color:#FFAB70;">instance</span><span style="color:#E1E4E8;"> }) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">sym</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">in</span><span style="color:#E1E4E8;"> instance.exports) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (sym.</span><span style="color:#B392F0;">startsWith</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;__napi_register__&#39;</span><span style="color:#E1E4E8;">)) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        instance.exports[sym]()</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">overwriteImports</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">importObject</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    importObject.env </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">...</span><span style="color:#E1E4E8;">importObject.env,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">...</span><span style="color:#E1E4E8;">importObject.napi,</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">...</span><span style="color:#E1E4E8;">importObject.emnapi</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}).</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(({ </span><span style="color:#FFAB70;">napiModule</span><span style="color:#E1E4E8;"> }) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">binding</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> napiModule.exports</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// output: 5</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(binding.</span><span style="color:#B392F0;">fibonacci</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">5</span><span style="color:#E1E4E8;">))</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">fs</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">require</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;fs&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">path</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">require</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;path&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">useWASI</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">let</span><span style="color:#24292E;"> wasi</span></span>
<span class="line"><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (useWASI) {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> { </span><span style="color:#005CC5;">WASI</span><span style="color:#24292E;"> } </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">require</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;wasi&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">  wasi </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">WASI</span><span style="color:#24292E;">({ </span><span style="color:#6A737D;">/* ... */</span><span style="color:#24292E;"> })</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> { </span><span style="color:#005CC5;">instantiateNapiModule</span><span style="color:#24292E;"> } </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">require</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;@emnapi/core&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">wasmBuffer</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> useWASI</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> fs.</span><span style="color:#6F42C1;">readFileSync</span><span style="color:#24292E;">(path.</span><span style="color:#6F42C1;">join</span><span style="color:#24292E;">(__dirname, </span><span style="color:#032F62;">&#39;./target/wasm32-wasi/release/binding.wasm&#39;</span><span style="color:#24292E;">))</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> fs.</span><span style="color:#6F42C1;">readFileSync</span><span style="color:#24292E;">(path.</span><span style="color:#6F42C1;">join</span><span style="color:#24292E;">(__dirname, </span><span style="color:#032F62;">&#39;./target/wasm32-unknown-unknown/release/binding.wasm&#39;</span><span style="color:#24292E;">))</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">instantiateNapiModule</span><span style="color:#24292E;">(wasmBuffer, {</span></span>
<span class="line"><span style="color:#24292E;">  context: </span><span style="color:#6F42C1;">require</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;@emnapi/runtime&#39;</span><span style="color:#24292E;">).</span><span style="color:#6F42C1;">getDefaultContext</span><span style="color:#24292E;">(),</span></span>
<span class="line"><span style="color:#24292E;">  wasi,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">beforeInit</span><span style="color:#24292E;"> ({ </span><span style="color:#E36209;">instance</span><span style="color:#24292E;"> }) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">sym</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">in</span><span style="color:#24292E;"> instance.exports) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (sym.</span><span style="color:#6F42C1;">startsWith</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;__napi_register__&#39;</span><span style="color:#24292E;">)) {</span></span>
<span class="line"><span style="color:#24292E;">        instance.exports[sym]()</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">overwriteImports</span><span style="color:#24292E;"> (</span><span style="color:#E36209;">importObject</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    importObject.env </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">...</span><span style="color:#24292E;">importObject.env,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">...</span><span style="color:#24292E;">importObject.napi,</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">...</span><span style="color:#24292E;">importObject.emnapi</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}).</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(({ </span><span style="color:#E36209;">napiModule</span><span style="color:#24292E;"> }) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">binding</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> napiModule.exports</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// output: 5</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(binding.</span><span style="color:#6F42C1;">fibonacci</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">))</span></span>
<span class="line"><span style="color:#24292E;">})</span></span></code></pre></div></div></div>`,3),e=[o];function t(c,r,E,y,i,u){return n(),a("div",null,e)}const d=s(p,[["render",t]]);export{q as __pageData,d as default};
