# 多线程异步

- [napi_create_async_work](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_create_async_work)
- [napi_delete_async_work](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_delete_async_work)
- [napi_queue_async_work](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_queue_async_work)
- [napi_cancel_async_work](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_cancel_async_work)

多线程异步 API 需要启用 pthreads，并且需要编译额外的 C 源文件。推荐直接[使用 CMake](/zh/guide/using-cmake.html)。

```cmake
add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/node_modules/@tybys/emnapi")

add_executable(hello hello.c)

target_link_libraries(hello emnapi_full-mt)
target_compile_options(hello PRIVATE "-sUSE_PTHREADS=1")
target_link_options(hello PRIVATE
  "-sALLOW_MEMORY_GROWTH=1"
  "-sEXPORTED_FUNCTIONS=['_malloc','_free']"
  "-sUSE_PTHREADS=1"
  "-sPTHREAD_POOL_SIZE=4"
)
```

```bash
emcmake cmake -DCMAKE_BUILD_TYPE=Release -DEMNAPI_WORKER_POOL_SIZE=4 -G Ninja -H. -Bbuild
cmake --build build
```

同时还建议指定线程池大小：

```cmake
target_link_options(hello PRIVATE
  "-sUSE_PTHREADS=1"
  "-sPTHREAD_POOL_SIZE=4"
)
```

## 预处理宏选项

### `-DEMNAPI_WORKER_POOL_SIZE=4`

等价于编译时的 [`UV_THREADPOOL_SIZE`](http://docs.libuv.org/en/v1.x/threadpool.html?highlight=UV_THREADPOOL_SIZE)，如果未定义，emnapi 会在运行时读取 Emscripten 的 `UV_THREADPOOL_SIZE` [环境变量](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#interacting-with-code-environment-variables)，你可以像这样设置 `UV_THREADPOOL_SIZE`：

```js
Module.preRun = Module.preRun || [];
Module.preRun.push(function () {
  if (typeof ENV !== 'undefined') {
    ENV.UV_THREADPOOL_SIZE = '2';
  }
});
```

它代表最大可并行执行的异步工作（`napi_queue_async_work`。默认未定义，运行时读取 `UV_THREADPOOL_SIZE` 环境变量。

通常境况下你可以将 `PTHREAD_POOL_SIZE` 和 `EMNAPI_WORKER_POOL_SIZE` 都设置成 `CPU 核心数`。如果你使用了另外一个多线程库中的函数，它会在异步工作中创建 `N` 个子线程，你就需要把 `PTHREAD_POOL_SIZE` 设置为 `EMNAPI_WORKER_POOL_SIZE * (N + 1)`。

这个选项仅当设置了 `-sUSE_PTHREADS` 才有效。emnapi 会在初始化时创建 `EMNAPI_WORKER_POOL_SIZE` 个线程，如果 `PTHREAD_POOL_SIZE < EMNAPI_WORKER_POOL_SIZE && PTHREAD_POOL_SIZE_STRICT == 2` 则会抛出错误。

更多详情细节请查看 [Issue #8](https://github.com/toyobayashi/emnapi/issues/8)。

### `-DEMNAPI_NEXTTICK_TYPE=0`

这个选项仅当设置了 `-sUSE_PTHREADS` 才有效。默认是 `0`。告诉 emnapi 要如何在 `uv_async_send` / `uv__async_close` 中延迟执行异步工作。

- `0`: 使用 `setImmediate()`（Node.js 原生 `setImmediate` 或浏览器的 `MessageChannel` 和 `port.postMessage`）
- `1`: 使用 `Promise.resolve().then()`

### `-DEMNAPI_USE_PROXYING=1`

这个选项仅当设置了 `-sUSE_PTHREADS` 才有效。Emscripten 版本 `>= 3.1.9` 默认是 `1`，否则默认是 `0`。

- `0`

    使用 JavaScript 实现从工作线程发送异步工作，运行时代码将访问 Emscripten 内部的 `PThread` 对象来添加自定义的 Worker 消息监听器。

- `1`:

    使用 Emscripten 的 [proxying API](https://emscripten.org/docs/api_reference/proxying.h.html) 在 C 代码中从工作线程发送异步工作。如果你遇到任何问题，你可以把他设置为 `0` 并报告 Issue。

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
      // 已完成所有批次的执行
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

C 实现：

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

- [node-addon-api AsyncWorker 类](https://github.com/nodejs/node-addon-api/blob/v5.0.0/doc/async_worker.md)

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
