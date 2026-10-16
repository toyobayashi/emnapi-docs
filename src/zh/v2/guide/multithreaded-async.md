# 多线程异步

- [napi_create_async_work](https://nodejs.org/docs/latest/api/n-api.html#napi_create_async_work)
- [napi_delete_async_work](https://nodejs.org/docs/latest/api/n-api.html#napi_delete_async_work)
- [napi_queue_async_work](https://nodejs.org/docs/latest/api/n-api.html#napi_queue_async_work)
- [napi_cancel_async_work](https://nodejs.org/docs/latest/api/n-api.html#napi_cancel_async_work)

emnapi 2.x 提供两种异步工作和线程安全函数实现方式：

- emnapi-mt C 库使用 pthread 和内置的 libuv 移植版本，适用于 Emscripten pthread 和 wasm32-wasip1-threads 目标。
- 基础 wasm32-wasip1 组合从 JavaScript 导入 async work 和 TSFN 函数，可通过 @emnapi/core 插件提供实现。

基础 Node.js WASI 模块可以这样提供 JavaScript 实现；浏览器中请传入 @tybys/wasm-util 等 WASI 实现：

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

使用 Emscripten pthread 时，以 -pthread 编译并链接 -lemnapi-mt，同时根据 addon 创建的线程数量设置 worker pool。WASI 多线程使用 wasm32-wasip1-threads 和 -lemnapi-mt。

浏览器使用 worker 和共享内存时需要跨源隔离。请用以下响应头提供页面：

~~~http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
~~~

WASI pthread 使用共享 WebAssembly 内存。浏览器主线程不能在 Atomics.wait 中阻塞；不要让线程创建操作在浏览器主线程等待 worker 启动。

## 预编译库

npm 包在 emnapi/lib 下按目标提供静态库。多线程构建链接 -lemnapi-mt。wasm32-wasip1-threads 使用的目录取决于 wasi-sdk 版本：wasi-sdk 33 及更早版本使用 emnapi/lib/wasm32-wasip1-threads，wasi-sdk 34 及更新版本使用 emnapi/lib/wasm32-wasip1-threads-wasi-sdk-34。库目录必须与链接时使用的 SDK 版本匹配。

## CMake

完整配置命令请参阅 v2/guide/using-cmake.html。emnapi-mt target 提供带线程支持的 C 实现。Emscripten 构建需要根据应用的 worker 数量设置 -sPTHREAD_POOL_SIZE 和 -sPTHREAD_POOL_SIZE_STRICT。

## 初始化

JavaScript 初始化方式取决于构建目标。Emscripten 会从生成的模块创建 pthread worker。WASI pthread 构建使用 @emnapi/core，并需要一个处理子线程消息的 worker 入口。

对于 Emscripten，在 ES 模块工厂函数完成后初始化模块。asyncWorkPoolSize 必须小于可用的 PTHREAD_POOL_SIZE：

~~~js
import init from './out/hello.js'
import { createContext } from '@emnapi/runtime'

const Module = await init()
const binding = Module.emnapiInit({
  context: createContext(),
  asyncWorkPoolSize: 3
})
~~~

对于 wasm32-wasip1-threads，需要提供共享内存、WASI 实例和 worker 工厂。worker 入口必须初始化 MessageHandler，并使用 childThread: true 加载子线程模块。仓库中的 [WASI 模块加载器示例](https://github.com/toyobayashi/emnapi/blob/main/packages/example/wasi-module-loader.js)包含完整的 Node.js 和浏览器 worker 初始化代码。

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

浏览器主线程不能在 Atomics.wait 中阻塞，因此不要在浏览器主线程启用 waitThreadStart。Node.js 和浏览器 worker 中可以启用它，让 pthread_create 等待 worker 就绪。浏览器中的共享 WebAssembly 内存还要求跨源隔离，并设置以下 COOP 和 COEP 响应头：

~~~http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
~~~

启用 reuseWorker 时，asyncWorkPoolSize 应小于 reuseWorker.size。异步 instantiateAddon 和 loadAddon 会等待池中的 worker 加载完成。同步版本会在后台开始加载 worker 池，并立即返回。空闲时加载失败的 worker 会被替换；尚未加载的 worker 会在首次使用时加载。

## 预处理宏选项

### EMNAPI_WORKER_POOL_SIZE

EMNAPI_WORKER_POOL_SIZE 为正数时，会在编译期设置 libuv 异步工作线程数，并覆盖运行时线程池大小。未设置时，emnapi 会优先读取 asyncWorkPoolSize，其次读取 UV_THREADPOOL_SIZE；如果都未设置，则默认使用 4 个线程。线程池大小不能超过可用的 pthread worker 数量。

~~~js
const binding = Module.emnapiInit({
  context: createContext(),
  asyncWorkPoolSize: 3
})
~~~

对于 WASI，如果没有指定 asyncWorkPoolSize，也可以通过 WASI 环境传入 UV_THREADPOOL_SIZE。

### EMNAPI_NEXTTICK_TYPE

此选项控制线程构建中 emnapi 如何调度 libuv 异步通知，默认值为 0。

- 0：使用 setImmediate；浏览器中使用运行时提供的 message-channel 调度。
- 1：使用 Promise.resolve().then()。

### EMNAPI_USE_PROXYING

此选项控制 Emscripten pthread 构建中的异步通知方式。Emscripten 3.1.9 及更新版本默认为 1；其他目标默认为 0。

- 0：使用 emnapi 的 JavaScript worker 消息监听器。
- 1：在 C 代码中使用 Emscripten proxying API。

## 示例

在子线程中使用蒙特卡罗方法估计 π 的值。在 \[0,1]\[0,1] 平面上获取随机 x 和 y 值的 `points` 个点样本。
计算对角线的长度可以告诉我们该点是位于从 0,1 到 1,0 的四分之一圆的内部还是外部。内部与外部的点数之比为我们提供了 π/4 的近似值。

导出函数的签名：

```ts
/** 
 * 如果线程池中有空闲线程，该函数会创建一个子线程。
 * 计算结果后会在主线程中调用回调函数。
 */
export declare function estimate(
  points: number,
  callback: {
    (err: Error): void
    (err: null, result: number): void
  }
): void
```

用例：

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

C 实现：

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

## Node-API 实现

### 辅助宏与初始化

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

### 绑定函数

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

### 执行

```c
// 在子线程中调用
// 不可使用与 JavaScript 交互的 API
static void estimate_on_execute(napi_env env, void* data) {
  estimate_request* request = (estimate_request*) data;
  request->result = monte_carlo_estimate_pi(request->points);
}
```

### 完成

```c
// 在主线程中调用
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

### 返回 Promise

函数签名：

```ts
export declare function estimate(points: number): Promise<number>
```

请求的结构体：

```c
typedef struct {
  int points;
  double result;
  napi_deferred deferred;
  napi_async_work work;
} estimate_request;
```

返回 Promise：

```c
static napi_value js_estimate(napi_env env, napi_callback_info info) {
  // ...

  napi_value promise;
  napi_create_promise(env, &request->deferred, &promise);

  // ...

  return promise;
}
```

完成后 resolve 或 reject：

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

## node-addon-api 实现

::: warning

如果运行时不支持 `FinalizationRegistry` 和 `WeakRef`则**不能**使用 node-addon-api。

:::

- [node-addon-api AsyncWorker 类](https://github.com/nodejs/node-addon-api/blob/main/doc/async_worker.md)

### 绑定函数

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

### 继承 AsyncWorker 类

```cpp
class MonteCarloEstimatePiWorker : public Napi::AsyncWorker {
 public:
  MonteCarloEstimatePiWorker(int points, const Napi::Function& callback)
      : Napi::AsyncWorker(callback), points_(points), result_(0) {}

  void Execute() {
    // 在子线程
    result_ = monte_carlo_estimate_pi(points_);
  }

  void OnOK() {
    // 在主线程
    Callback().Call(Env().Undefined(), {
      Env().Null(),
      Napi::Number::New(Env(), result_)
    });
  }

  void OnError(const Napi::Error& e) {
    // 在主线程
    Callback().Call(Env().Undefined(), { e.Value() });
  }

 private:
  int points_;
  double result_;
};
```

### Return Promise

函数签名：

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
