# Multithreaded Asynchronous Operations

- [napi_create_async_work](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_create_async_work)
- [napi_delete_async_work](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_delete_async_work)
- [napi_queue_async_work](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_queue_async_work)
- [napi_cancel_async_work](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_cancel_async_work)

Emnapi has 3 implementations of async work and 2 implementations of TSFN:

- Async work
    - A. Libuv threadpool and pthread based implementation in C
    - B. Single thread mock in JavaScript
    - C. Web worker based implementation in C (stack allocation) and JavaScript
- TSFN
    - D. Libuv and pthread based implementation in C
    - E. Web worker based implementation in JavaScript

|   | Library to Link        | `wasm32-emscripten` | `wasm32` | `wasm32-wasi` | `wasm32-wasi-threads` |
|---|------------------------|---------------------|----------|---------------|-----------------------|
| A | libemnapi-mt.a         | ✅                   | ❌        | ❌             | ✅                     |
| B | libemnapi-basic(-mt).a | ✅                   | ✅        | ✅             | ✅                     |
| C | libemnapi-basic-mt.a   | ❌                   | ✅        | ❌             | ✅                     |
| D | libemnapi-mt.a         | ✅                   | ❌        | ❌             | ✅                     |
| E | libemnapi-basic(-mt).a | ✅                   | ✅        | ✅             | ✅                     |

There are some limitations on browser about wasi-libc's pthread implementation, for example
`pthread_mutex_lock` may call `__builtin_wasm_memory_atomic_wait32`(`memory.atomic.wait32`)
which is disallowed in browser JS main thread. While Emscripten's pthread implementation
has considered usage in browser. If you need to run your addon with multithreaded features on browser,
we recommend you use Emscripten A & D, or bare wasm32 C & E.

Note: For browsers, all the multithreaded features relying on Web Workers (Emscripten pthread also relying on Web Workers)
require cross-origin isolation to enable `SharedArrayBuffer`. You can make a page cross-origin isolated
by serving the page with these headers:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

If you would like to avoid `SharedArrayBuffer` and cross-origin isolation, please use B & E (link `libemnapi-basic.a`), see the following table for more details.

## About Prebuilt Libraries

Prebuilt libraries can be found in the `lib` directory in `emnapi` npm package.

| Library              | Description                                                                                                                                                                                                                                                   | `wasm32-emscripten` | `wasm32` | `wasm32-wasi` | `wasm32-wasi-threads`                   |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|----------|---------------|-----------------------------------------|
| libemnapi.a          | no atomics feature.<br/><br/> no libuv port.<br/><br/> `napi_*_async_work` and `napi_*_threadsafe_function` always return `napi_generic_failure`.                                                                                                                         | ✅                   | ✅        | ✅             | ✅ |
| libemnapi-mt.a       | atomics feature enabled.<br/><br/> `napi_*_async_work` and `napi_*_threadsafe_function` are based on pthread and libuv port.                                                                                                                                        | ✅                   | ❌        | ❌             | ✅ |
| libemnapi-basic.a    | no atomics feature.<br/><br/> no libuv port.<br/><br/> `napi_*_async_work` and `napi_*_threadsafe_function` are imported from JavaScript land.                                                                                                                            | ✅                   | ✅        | ✅             | ✅ |
| libemnapi-basic-mt.a | atomics feature enabled.<br/><br/> no libuv port.<br/><br/> `napi_*_async_work` and `napi_*_threadsafe_function` are imported from JavaScript land.<br/><br/> include `emnapi_async_worker_create` and `emnapi_async_worker_init` for WebWorker based async work implementation. | ❌                   | ✅        | ✅             | ✅ |
| libdlmalloc.a        | no atomics feature, no thread safe garanteed.                                                                                                                                                                                                                 | ❌                   | ✅        | ❌             | ❌                                       |
| libdlmalloc-mt.a     | atomics feature enabled, thread safe.                                                                                                                                                                                                                         | ❌                   | ✅        | ❌             | ❌                                       |
| libemmalloc.a        | no atomics feature, no thread safe garanteed.                                                                                                                                                                                                                 | ❌                   | ✅        | ❌             | ❌                                       |
| libemmalloc-mt.a     | atomics feature enabled, thread safe.                                                                                                                                                                                                                         | ❌                   | ✅        | ❌             | ❌                                       |

## CMake

```cmake
add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/node_modules/emnapi")

add_executable(hello hello.c)

if(CMAKE_SYSTEM_NAME STREQUAL "Emscripten")
  target_link_libraries(hello emnapi-mt)
  target_compile_options(hello PRIVATE "-pthread")
  target_link_options(hello PRIVATE
    "-sALLOW_MEMORY_GROWTH=1"
    "-sEXPORTED_FUNCTIONS=['_napi_register_wasm_v1','_node_api_module_get_api_version_v1','_malloc','_free']"
    "-pthread"
    "-sPTHREAD_POOL_SIZE=4"
    # try to specify stack size if you experience pthread errors
    "-sSTACK_SIZE=2MB"
    "-sDEFAULT_PTHREAD_STACK_SIZE=2MB"
  )
elseif(CMAKE_C_COMPILER_TARGET STREQUAL "wasm32-wasi-threads")
  target_link_libraries(hello emnapi-mt)
  set_target_properties(hello PROPERTIES SUFFIX ".wasm")
  target_compile_options(hello PRIVATE "-fno-exceptions" "-pthread")
  target_link_options(hello PRIVATE
    "-pthread"
    "-mexec-model=reactor"
    "-Wl,--import-memory"
    "-Wl,--max-memory=2147483648"
    "-Wl,--export-dynamic"
    "-Wl,--export=malloc"
    "-Wl,--export=free"
    "-Wl,--import-undefined"
    "-Wl,--export-table"
  )
elseif((CMAKE_C_COMPILER_TARGET STREQUAL "wasm32") OR (CMAKE_C_COMPILER_TARGET STREQUAL "wasm32-unknown-unknown"))
  target_link_libraries(hello emnapi-basic-mt)
  set_target_properties(hello PROPERTIES SUFFIX ".wasm")
  target_compile_options(hello PRIVATE "-fno-exceptions" "-matomics" "-mbulk-memory")
  target_link_options(hello PRIVATE
    "-nostdlib"
    "-Wl,--no-entry"
    "-Wl,--export=napi_register_wasm_v1"
    "-Wl,--export-if-defined=node_api_module_get_api_version_v1"
    "-Wl,--export=emnapi_async_worker_create"
    "-Wl,--export=emnapi_async_worker_init"
    "-Wl,--import-memory,--shared-memory,--max-memory=2147483648,--import-undefined"
    "-Wl,--export-dynamic,--export=malloc,--export=free,--export-table"
  )
endif()
```

```bash
emcmake cmake -DCMAKE_BUILD_TYPE=Release \
              -DEMNAPI_FIND_NODE_ADDON_API=ON \
              -DEMNAPI_WORKER_POOL_SIZE=4 \
              -G Ninja -H. -Bbuild

# wasi-sdk with thread support
cmake -DCMAKE_TOOLCHAIN_FILE=$WASI_SDK_PATH/share/cmake/wasi-sdk-pthread.cmake \
      -DWASI_SDK_PREFIX=$WASI_SDK_PATH \
      -DEMNAPI_WORKER_POOL_SIZE=4 \
      -DEMNAPI_FIND_NODE_ADDON_API=ON \
      -DCMAKE_BUILD_TYPE=Release \
      -G Ninja -H. -Bbuild

cmake -DCMAKE_TOOLCHAIN_FILE=node_modules/emnapi/cmake/wasm32.cmake \
      -DLLVM_PREFIX=$WASI_SDK_PATH \
      -DCMAKE_BUILD_TYPE=Release \
      -G Ninja -H. -Bbuild

cmake --build build
```

## Initialization

Additional work is required during instantiating wasm compiled with non-emscripten.

```js
// emnapi main thread (could be in a Worker)
instantiateNapiModule(input, {
  context: getDefaultContext(),
  /**
   * emscripten
   *   0: no effect
   *   > 0: the same effect to UV_THREADPOOL_SIZE
   * non-emscripten
   *   0: single thread mock
   *   > 0 schedule async work in web worker
   */
  asyncWorkPoolSize: 4, // 0: single thread mock, > 0: schedule async work in web worker
  wasi: new WASI(/* ... */),
  // reuseWorker: true,
  onCreateWorker () {
    return new Worker('./worker.js')
    // Node.js
    // const { Worker } = require('worker_threads')
    // return new Worker(join(__dirname, './worker.js'), {
    //   env: process.env,
    //   execArgv: ['--experimental-wasi-unstable-preview1']
    // })
  },
  overwriteImports (importObject) {
    importObject.env.memory = new WebAssembly.Memory({
      initial: 16777216 / 65536,
      maximum: 2147483648 / 65536,
      shared: true
    })
  }
})
```

```js
// worker.js
(function () {
  let fs, WASI, emnapiCore

  const ENVIRONMENT_IS_NODE =
    typeof process === 'object' && process !== null &&
    typeof process.versions === 'object' && process.versions !== null &&
    typeof process.versions.node === 'string'

  if (ENVIRONMENT_IS_NODE) {
    const nodeWorkerThreads = require('worker_threads')

    const parentPort = nodeWorkerThreads.parentPort

    parentPort.on('message', (data) => {
      globalThis.onmessage({ data })
    })

    fs = require('fs')

    Object.assign(globalThis, {
      self: globalThis,
      require,
      Worker: nodeWorkerThreads.Worker,
      importScripts: function (f) {
        (0, eval)(fs.readFileSync(f, 'utf8') + '//# sourceURL=' + f)
      },
      postMessage: function (msg) {
        parentPort.postMessage(msg)
      }
    })

    WASI = require('wasi').WASI
    emnapiCore = require('@emnapi/core')
  } else {
    importScripts('./node_modules/memfs-browser/dist/memfs.js')
    importScripts('./node_modules/@tybys/wasm-util/dist/wasm-util.min.js')
    importScripts('./node_modules/@emnapi/core/dist/emnapi-core.js')
    emnapiCore = globalThis.emnapiCore

    const { Volume, createFsFromVolume } = memfs
    fs = createFsFromVolume(Volume.fromJSON({
      '/': null
    }))

    WASI = globalThis.wasmUtil.WASI
  }

  const { instantiateNapiModuleSync, MessageHandler } = emnapiCore

  const handler = new MessageHandler({
    onLoad ({ wasmModule, wasmMemory }) {
      const wasi = new WASI({ fs })

      return instantiateNapiModuleSync(wasmModule, {
        childThread: true,
        wasi,
        overwriteImports (importObject) {
          importObject.env.memory = wasmMemory
        }
      })
    }
  })

  globalThis.onmessage = function (e) {
    handler.handle(e)
    // handle other messages
  }
})()
```

## Preprocess Macro Options

### `-DEMNAPI_WORKER_POOL_SIZE=4`

This is [`UV_THREADPOOL_SIZE`](http://docs.libuv.org/en/v1.x/threadpool.html?highlight=UV_THREADPOOL_SIZE) equivalent at compile time, if not predefined, emnapi will read `asyncWorkPoolSize` option or `UV_THREADPOOL_SIZE` from Emscripten [environment variable](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#interacting-with-code-environment-variables) at runtime:

```js
Module.init({
  // ...
  asyncWorkPoolSize: 2
})

// if asyncWorkPoolSize is not specified
Module.preRun = Module.preRun || [];
Module.preRun.push(function () {
  if (typeof ENV !== 'undefined') {
    ENV.UV_THREADPOOL_SIZE = '2';
  }
});
```

```js
// wasi
instantiateNapiModule({
  // ...
  asyncWorkPoolSize: 2
})
// if asyncWorkPoolSize is not specified
new WASI({
  env: {
    UV_THREADPOOL_SIZE: '2'
  }
})
```

It represent max of `EMNAPI_WORKER_POOL_SIZE` async work (`napi_queue_async_work`) can be executed in parallel. Default is not defined.

You can set both `PTHREAD_POOL_SIZE` and `EMNAPI_WORKER_POOL_SIZE` to `number of CPU cores` in general.
If you use another library function which may create `N` child threads in async work,
then you need to set `PTHREAD_POOL_SIZE` to `EMNAPI_WORKER_POOL_SIZE * (N + 1)`.

This option only has effect if you use `-pthread`.
Emnapi will create `EMNAPI_WORKER_POOL_SIZE` threads when initializing,
it will throw error if `PTHREAD_POOL_SIZE < EMNAPI_WORKER_POOL_SIZE && PTHREAD_POOL_SIZE_STRICT == 2`.

See [Issue #8](https://github.com/toyobayashi/emnapi/issues/8) for more detail.

### `-DEMNAPI_NEXTTICK_TYPE=0`

This option only has effect if you use `-pthread`, Default is `0`.
Tell emnapi how to delay async work in `uv_async_send` / `uv__async_close`.

- `0`: Use `setImmediate()` (Node.js native `setImmediate` or browser `MessageChannel` and `port.postMessage`)
- `1`: Use `Promise.resolve().then()`

### `-DEMNAPI_USE_PROXYING=1`

This option only has effect if you use emscripten `-pthread`. Default is `1` if emscripten version `>= 3.1.9`, else `0`.

- `0`

    Use JavaScript implementation to send async work from worker threads, runtime code will access the Emscripten internal `PThread` object to add custom worker message listener.

- `1`:

    Use Emscripten [proxying API](https://emscripten.org/docs/api_reference/proxying.h.html) to send async work from worker threads in C. If you experience something wrong, you can switch set this to `0` and feel free to create an issue.

## Example

Estimate the value of π by using a Monte Carlo method in child threads.
Take `points` samples of random x and y values on a
\[0,1]\[0,1] plane. Calculating the length of the diagonal
tells us whether the point lies inside, or outside a
quarter circle running from 0,1 to 1,0. The ratio of the
number of points inside to outside gives us an
approximation of π/4.

Exposed function signature:

```ts
/** 
 * This function creates a child thread if
 * there are idle threads in the thread pool.
 * Callback will be called in main thread after calculating.
 */
export declare function estimate(
  points: number,
  callback: {
    (err: Error): void
    (err: null, result: number): void
  }
): void
```

Use case:

```js
Module.onRuntimeInitialized = function () {
  const calculations = 100000000
  const batches = 16
  let ended = 0
  let total = 0
  let start = Date.now()

  function done (err, result) {
    total += result;
    console.log(result)

    if (++ended === batches) {
      // have all the batches finished executing
      const pi = total / batches
      const ms = Date.now() - start
      console.log('\tπ ≈ ' + pi +
                  ' (' + Math.abs(pi - Math.PI) + ' away from actual)')
      console.log('\tTook ' + ms + 'ms')
      console.log()
    }
  }
  for (let i = 0; i < batches; ++i) {
    Module.emnapiExports.estimate(100000000, done)
  }
}
```

C implementation:

```c
#include <stdlib.h>
#include <pthread.h>

#ifdef __cplusplus
extern "C" {
#endif

double monte_carlo_estimate_pi(int points);

#ifdef __cplusplus
}
#endif

static pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
static unsigned int randseed = 0;

double monte_carlo_estimate_pi(int points) {
  int i = points;
  int inside = 0;
  unsigned int seed;

  pthread_mutex_lock(&mutex);
  if (randseed == 0) {
    randseed = time(NULL);
  }
  seed = rand_r(&randseed);
  pthread_mutex_unlock(&mutex);

  double rand_max = (double) RAND_MAX;

  while (i-- > 0) {
    double x = rand_r(&seed) / rand_max;
    double y = rand_r(&seed) / rand_max;

    if ((x * x) + (y * y) <= 1) ++inside;
  }

  return (inside / (double) points) * 4;
}
```

## Node-API Implementation

### Helper Macros and Initialization

```c
#include <stdlib.h>
#include <node_api.h>

#define NAPI_CALL_BASE(env, the_call, ...) /* ... */
#define NAPI_CALL(env, the_call)           /* ... */
#define NAPI_CALL_VOID(env, the_call)      /* ... */

NAPI_MODULE_INIT() {
  napi_value estimate_fn;
  NAPI_CALL(env, napi_create_function(env, "estimate", NAPI_AUTO_LENGTH,
                                      js_estimate, NULL, &estimate_fn));
  NAPI_CALL(env, napi_set_named_property(env, exports,
                                         "estimate", estimate_fn));
  return exports;
}
```

### Binding Function

```c
typedef struct {
  int points;
  double result;
  napi_ref callback;
  napi_async_work work;
} estimate_request;

static napi_value js_estimate(napi_env env, napi_callback_info info) {
  size_t argc = 2;
  napi_value args[2];
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  if (argc < 2) {
    napi_throw_type_error(env, NULL, "Wrong number of arguments");
    return NULL;
  }

  napi_valuetype valuetype0, valuetype1;
  NAPI_CALL(env, napi_typeof(env, args[0], &valuetype0));
  NAPI_CALL(env, napi_typeof(env, args[1], &valuetype1));

  if (valuetype0 != napi_number || valuetype1 != napi_function) {
    napi_throw_type_error(env, NULL, "Wrong arguments");
    return NULL;
  }

  estimate_request* request =
    (estimate_request*) malloc(sizeof(estimate_request));
  if (!request) {
    napi_throw_type_error(env, NULL, "malloc failed");
    return NULL;
  }

  napi_status status;

  status = napi_get_value_int32(env, args[0], &request->points);
  if (status != napi_ok) {
    free(request);
    NAPI_CALL(env, status);
    return NULL;
  }

  status = napi_create_reference(env, args[1], 1, &request->callback);
  if (status != napi_ok) {
    free(request);
    NAPI_CALL(env, status);
    return NULL;
  }

  status = napi_create_async_work(env, NULL, NULL,
                                  estimate_on_execute,
                                  estimate_on_complete,
                                  request,
                                  &request->work);
  if (status != napi_ok) {
    free(request);
    NAPI_CALL(env, status);
    return NULL;
  }

  status = napi_queue_async_work(env, request->work);
  if (status != napi_ok) {
    free(request);
    NAPI_CALL(env, status);
    return NULL;
  }

  return NULL;
}
```

### Execute

```c
// invoked in child thread
// can not interact with JavaScript
static void estimate_on_execute(napi_env env, void* data) {
  estimate_request* request = (estimate_request*) data;
  request->result = monte_carlo_estimate_pi(request->points);
}
```

### Complete

```c
// invoked in main thread
static void estimate_on_complete(napi_env env, napi_status status, void* data) {
  estimate_request* req = (estimate_request*) data;
  estimate_request request = *req;
  free(req);
  napi_value undefined, callback, callback_ret;
  NAPI_CALL_VOID(env, napi_get_undefined(env, &undefined));
  NAPI_CALL_VOID(env, napi_get_reference_value(env,
                                               request.callback,
                                               &callback));
  if (status != napi_ok) {
    napi_value err, errmsg;
    NAPI_CALL_VOID(env, napi_create_string_utf8(env, "Execute failed.",
                                                NAPI_AUTO_LENGTH,
                                                &errmsg));
    NAPI_CALL_VOID(env, napi_create_error(env, NULL, errmsg, &err));
    NAPI_CALL_VOID(env, napi_call_function(env, undefined, callback,
                                           1, &err, &callback_ret));
  } else {
    napi_value callback_argv[2];
    NAPI_CALL_VOID(env, napi_get_null(env, callback_argv));
    NAPI_CALL_VOID(env, napi_create_double(env,
                                          request.result, callback_argv + 1));
    NAPI_CALL_VOID(env, napi_call_function(env, undefined, callback,
                                          2, callback_argv, &callback_ret));
  }
  NAPI_CALL_VOID(env, napi_delete_reference(env, request.callback));
  NAPI_CALL_VOID(env, napi_delete_async_work(env, request.work));
}
```

### Return Promise

Function signature:

```ts
export declare function estimate(points: number): Promise<number>
```

Request structure:

```c
typedef struct {
  int points;
  double result;
  napi_deferred deferred;
  napi_async_work work;
} estimate_request;
```

Return promise:

```c
static napi_value js_estimate(napi_env env, napi_callback_info info) {
  // ...

  napi_value promise;
  napi_create_promise(env, &request->deferred, &promise);

  // ...

  return promise;
}
```

Resolve or reject on complete

```c
static void estimate_on_complete(napi_env env, napi_status status, void* data) {
  // ...
  if (status != napi_ok) {
    // ...
    NAPI_CALL_VOID(env, napi_reject_deferred(env, request.deferred, err));
  } else {
    // ...
    NAPI_CALL_VOID(env, napi_resolve_deferred(env, request.deferred, callback_argv[1]));
  }
}
```

## node-addon-api Implementation

::: warning

You **can not** use node-addon-api 
if the runtime does not support `FinalizationRegistry` and `WeakRef`.

:::

- [node-addon-api AsyncWorker Class](https://github.com/nodejs/node-addon-api/blob/v5.0.0/doc/async_worker.md)

### Binding Function

```cpp
#include <napi.h>

static Napi::Value JsEstimate(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 2) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong number of arguments");
    NAPI_THROW(e, Napi::Value());
  }

  if (!info[0].IsNumber() || !info[1].IsFunction()) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong arguments");
    NAPI_THROW(e, Napi::Value());
  }

  int points = info[0].As<Napi::Number>().Uint32Value();
  Napi::Function callback = info[1].As<Napi::Function>();
  auto* piWorker = new MonteCarloEstimatePiWorker(points, callback);
  piWorker->Queue();
  return info.Env().Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "estimate"),
              Napi::Function::New(env, JsEstimate, "estimate"));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
```

### Extending AsyncWorker Class

```cpp
class MonteCarloEstimatePiWorker : public Napi::AsyncWorker {
 public:
  MonteCarloEstimatePiWorker(int points, const Napi::Function& callback)
      : Napi::AsyncWorker(callback), points_(points), result_(0) {}

  void Execute() {
    // in child thread
    result_ = monte_carlo_estimate_pi(points_);
  }

  void OnOK() {
    // in main thread
    Callback().Call(Env().Undefined(), {
      Env().Null(),
      Napi::Number::New(Env(), result_)
    });
  }

  void OnError(const Napi::Error& e) {
    // in main thread
    Callback().Call(Env().Undefined(), { e.Value() });
  }

 private:
  int points_;
  double result_;
};
```

### Return Promise

Function signature:

```ts
export declare function estimate(points: number): Promise<number>
```

```cpp
class MonteCarloEstimatePiWorker : public Napi::AsyncWorker {
 public:
  MonteCarloEstimatePiWorker(int points, const Napi::Promise::Deferred& deferred)
      : Napi::AsyncWorker(deferred.Env()),
        points_(points),
        result_(0),
        deferred_(deferred) {}

  void Execute() {
    result_ = monte_carlo_estimate_pi(points_);
  }

  void OnOK() {
    deferred_.Resolve(Napi::Number::New(Env(), result_));
  }

  void OnError(const Napi::Error& e) {
    deferred_.Reject(e.Value());
  }

 private:
  int points_;
  double result_;
  Napi::Promise::Deferred deferred_;
};

static Napi::Value JsEstimate(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong number of arguments");
    NAPI_THROW(e, Napi::Value());
  }

  if (!info[0].IsNumber()) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong arguments");
    NAPI_THROW(e, Napi::Value());
  }

  int points = info[0].As<Napi::Number>().Uint32Value();
  Napi::Promise::Deferred deferred = Napi::Promise::Deferred::New(env);
  auto* piWorker = new MonteCarloEstimatePiWorker(points, deferred);
  piWorker->Queue();
  return deferred.Promise();
}
```
