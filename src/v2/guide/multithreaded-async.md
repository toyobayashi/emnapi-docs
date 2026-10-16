# Multithreaded Asynchronous Operations

- [napi_create_async_work](https://nodejs.org/docs/latest/api/n-api.html#napi_create_async_work)
- [napi_delete_async_work](https://nodejs.org/docs/latest/api/n-api.html#napi_delete_async_work)
- [napi_queue_async_work](https://nodejs.org/docs/latest/api/n-api.html#napi_queue_async_work)
- [napi_cancel_async_work](https://nodejs.org/docs/latest/api/n-api.html#napi_cancel_async_work)

emnapi 2.x provides two ways to implement asynchronous work and thread-safe functions:

- The emnapi-mt C library uses pthreads and the bundled libuv port. Use it with Emscripten pthreads or the wasm32-wasip1-threads target.
- The basic wasm32-wasip1 composition imports asynchronous-work and TSFN functions from JavaScript. Provide them with the @emnapi/core plugins.

For a basic Node.js WASI module, pass a WASI instance as well as the JavaScript implementations. In browsers, provide a WASI implementation such as @tybys/wasm-util:

~~~js
import { instantiateAddon } from '@emnapi/core'
import asyncWork from '@emnapi/core/plugins/async-work'
import threadSafeFunction from '@emnapi/core/plugins/threadsafe-function'
import { createContext } from '@emnapi/runtime'
import { WASI } from 'node:wasi'

const { addonModule } = await instantiateAddon(wasmBytes, {
  wasi: new WASI({ version: 'preview1' }),
  context: createContext(),
  plugins: [asyncWork, threadSafeFunction]
})
~~~

For Emscripten pthreads, compile with -pthread, link -lemnapi-mt, and size the worker pool for the threads your addon creates. For WASI threads, use wasm32-wasip1-threads and -lemnapi-mt.

Browser deployments using workers and shared memory require cross-origin isolation. Serve these headers:

~~~http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
~~~

WASI pthreads use shared WebAssembly memory. A browser main thread cannot block in Atomics.wait; avoid options that make thread creation wait on the browser main thread.

## Prebuilt Libraries

The npm package contains target-specific archives under emnapi/lib. Threaded builds link -lemnapi-mt. For wasm32-wasip1-threads, use emnapi/lib/wasm32-wasip1-threads with wasi-sdk 33 or older, and emnapi/lib/wasm32-wasip1-threads-wasi-sdk-34 with wasi-sdk 34 or newer. Keep the archive directory matched to the SDK used for linking.

## CMake

See Using CMake for complete configure commands. The emnapi-mt target supplies the threaded C implementation. For Emscripten, set -sPTHREAD_POOL_SIZE and -sPTHREAD_POOL_SIZE_STRICT to match the number of workers your application needs.

## Initialization

The JavaScript setup depends on the build target. Emscripten creates its pthread workers from the generated module. A WASI pthread build uses @emnapi/core and needs a worker entry that handles child-thread messages.

For Emscripten, initialize the module after its ES module factory resolves. asyncWorkPoolSize must be less than the available PTHREAD_POOL_SIZE:

~~~js
import init from './out/hello.js'
import { createContext } from '@emnapi/runtime'

const Module = await init()
const binding = Module.emnapiInit({
  context: createContext(),
  asyncWorkPoolSize: 3
})
~~~

For wasm32-wasip1-threads, provide shared memory, a WASI instance, and a worker factory. The worker entry must initialize a MessageHandler and load child modules with childThread: true. The repository's [WASI module loader example](https://github.com/toyobayashi/emnapi/blob/main/packages/example/wasi-module-loader.js) shows the complete Node.js and browser worker bootstrap.

~~~js
import { instantiateAddon } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'
import { Worker } from 'node:worker_threads'
import { readFile } from 'node:fs/promises'
import { WASI } from 'node:wasi'

const { addonModule } = await instantiateAddon(
  await readFile('./out/hello.wasm'),
  {
    context: createContext(),
    wasi: new WASI({ version: 'preview1' }),
    asyncWorkPoolSize: 3,
    waitThreadStart: true,
    reuseWorker: { size: 4, strict: true },
    onCreateWorker: () => new Worker(
      new URL('./wasi-worker.js', import.meta.url),
      { type: 'module' }
    ),
    overwriteImports(importObject) {
      importObject.env.memory = new WebAssembly.Memory({
        initial: 256,
        maximum: 65536,
        shared: true
      })
    }
  }
)
const binding = addonModule.exports
~~~

The browser main thread cannot block in Atomics.wait. Leave waitThreadStart disabled there; it can be enabled in Node.js or a browser worker when startup must wait until the worker is ready. A shared WebAssembly memory in browsers also requires cross-origin isolation. Serve COOP and COEP headers:

~~~http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
~~~

When reuseWorker is enabled, keep asyncWorkPoolSize less than reuseWorker.size. Asynchronous instantiateAddon and loadAddon wait for the pool workers to load. The synchronous variants start loading pool workers in the background and return without waiting. A worker that fails while idle is replaced; workers that have not loaded yet are loaded when first used.

## Preprocess Macro Options

### EMNAPI_WORKER_POOL_SIZE

A positive EMNAPI_WORKER_POOL_SIZE sets the libuv async-work thread count at compile time and overrides the runtime pool size. If it is not set, emnapi reads asyncWorkPoolSize first, then UV_THREADPOOL_SIZE; otherwise the library default is four threads. The selected pool must fit within the available pthread workers.

~~~js
const binding = Module.emnapiInit({
  context: createContext(),
  asyncWorkPoolSize: 3
})
~~~

For WASI, UV_THREADPOOL_SIZE can also be passed through the WASI environment when asyncWorkPoolSize is omitted.

### EMNAPI_NEXTTICK_TYPE

This option controls how emnapi schedules libuv async notifications in threaded builds. The default is 0.

- 0: Use setImmediate where available, with the runtime's message-channel scheduling in browsers.
- 1: Use Promise.resolve().then().

### EMNAPI_USE_PROXYING

This option controls async notifications for Emscripten pthread builds. Emscripten 3.1.9 and newer default to 1; other targets default to 0.

- 0: Use emnapi's JavaScript worker-message listener.
- 1: Use the Emscripten proxying API from C.

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
import init from './out/hello.js'
import { createContext } from '@emnapi/runtime'

const Module = await init()
const binding = Module.emnapiInit({
  context: createContext(),
  asyncWorkPoolSize: 3
})

const calculations = 100000000
const batches = 16
let ended = 0
let total = 0
const start = Date.now()

function done (err, result) {
  if (err) {
    console.error(err)
    return
  }
  total += result
  console.log(result)

  if (++ended === batches) {
    const pi = total / batches
    const ms = Date.now() - start
    console.log('\\tπ ≈ ' + pi +
                ' (' + Math.abs(pi - Math.PI) + ' away from actual)')
    console.log('\\tTook ' + ms + 'ms')
    console.log()
  }
}
for (let i = 0; i < batches; ++i) {
  binding.estimate(calculations, done)
}
```

C implementation:

```c
#include <stdlib.h>
#include <time.h>
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

- [node-addon-api AsyncWorker Class](https://github.com/nodejs/node-addon-api/blob/main/doc/async_worker.md)

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
