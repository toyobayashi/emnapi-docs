# Thread Safe function

- [napi_create_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_create_threadsafe_function)
- [napi_get_threadsafe_function_context](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_get_threadsafe_function_context)
- [napi_call_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_call_threadsafe_function)
- [napi_acquire_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_acquire_threadsafe_function)
- [napi_release_threadsafe_function](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#napi_release_threadsafe_function)

Require pthreads enabled:

```bash
emcc -sUSE_PTHREADS=1 ...
```

Specifying thread pool size is also recommended:

```bash
emcc -sUSE_PTHREADS=1 -sPTHREAD_POOL_SIZE=4 ...
```

::: tip

If you have pthreads enabled (`-sUSE_PTHREADS=1`),
the output JavaScript **can not** be used in bundler like webpack.

:::

See examples [here](https://github.com/toyobayashi/node-addon-examples/tree/emnapi/async_work_thread_safe_function/napi).
