# 线程安全函数

- [napi_create_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_create_threadsafe_function)
- [napi_get_threadsafe_function_context](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_get_threadsafe_function_context)
- [napi_call_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_call_threadsafe_function)
- [napi_acquire_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_acquire_threadsafe_function)
- [napi_release_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_release_threadsafe_function)

需要启用 pthreads：

```bash
emcc -sUSE_PTHREADS=1 ...
```

同时还建议指定线程池大小：

```bash
emcc -sUSE_PTHREADS=1 -sPTHREAD_POOL_SIZE=4 ...
```

::: tip

如果你启用了 pthreads (`-sUSE_PTHREADS=1`)，
输出的 JavaScript 就**不能**在 webpack 之类的打包器中使用。

:::

[在这里查看示例](https://github.com/toyobayashi/node-addon-examples/tree/emnapi/async_work_thread_safe_function/napi)。
