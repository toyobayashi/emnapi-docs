# 线程安全函数

- [napi_create_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_create_threadsafe_function)
- [napi_get_threadsafe_function_context](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_get_threadsafe_function_context)
- [napi_call_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_call_threadsafe_function)
- [napi_acquire_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_acquire_threadsafe_function)
- [napi_release_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_release_threadsafe_function)

需要启用 pthreads，在[这里](/zh/guide/multithreaded-async.html)查看如何使用多线程。

[在这里查看示例](https://github.com/toyobayashi/node-addon-examples/tree/emnapi/async_work_thread_safe_function/napi)。
