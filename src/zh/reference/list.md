---
sidebarDepth: 3
---

# API 列表

## 不可用的 API

::: danger

以下 API 不存在。

:::

#### js_native_api.h

- ~~napi_create_external_arraybuffer~~ (use [emnapi_create_external_uint8array][] instead)

#### node_api.h

- ~~napi_module_register~~
- ~~napi_async_init~~
- ~~napi_async_destroy~~
- ~~napi_make_callback~~
- ~~napi_create_buffer~~
- ~~napi_create_external_buffer~~
- ~~napi_create_buffer_copy~~
- ~~napi_is_buffer~~
- ~~napi_get_buffer_info~~
- ~~napi_get_uv_event_loop~~
- ~~napi_add_env_cleanup_hook~~
- ~~napi_remove_env_cleanup_hook~~
- ~~napi_open_callback_scope~~
- ~~napi_close_callback_scope~~
- ~~napi_add_async_cleanup_hook~~
- ~~napi_remove_async_cleanup_hook~~
- ~~node_api_get_module_file_name~~

## 受限的 API

### 引用相关

::: warning

只有 `Object` 和  `Function` 可以被引用，不支持 `Symbol`。

如果运行时不支持 [FinalizationRegistry](https://www.caniuse.com/?search=FinalizationRegistry) 和 [WeakRef](https://www.caniuse.com/?search=WeakRef)，下面的 API 有一定的限制，无论引用计数是否为 0，所有引用都是强引用。

:::

#### js_native_api.h

- ***napi_wrap***: `finalize_cb` 和 `result` 必须传 `NULL`, 稍后必须调用 `napi_remove_wrap`
- ***napi_create_external***: `finalize_cb` 必须传 `NULL`
- ***napi_create_reference***: 即使传 `0` 给 `initial_refcount` 也创建强引用
- ***napi_reference_unref***: 即使计数为 0，该引用仍然是强引用
- ***napi_add_finalizer***: 不可用，总是抛出错误

### BigInt 相关

::: warning

以下 API 需要 [BigInt](https://www.caniuse.com/?search=BigInt) (v8 引擎 v6.7+ / Node.js v10.4.0+)，如果运行时不支持，则抛出错误。

:::

#### js_native_api.h

- ***napi_create_bigint_int64***
- ***napi_create_bigint_uint64***
- ***napi_create_bigint_words***
- ***napi_get_value_bigint_int64***
- ***napi_get_value_bigint_uint64***
- ***napi_get_value_bigint_words***

### ArrayBuffer 相关

::: warning

`data` 指针返回值可能为 `NULL` 的 API：

:::

#### js_native_api.h

- ***napi_create_arraybuffer*** (`data` 总是返回 `NULL`，JS 无法实现)
- ***napi_get_arraybuffer_info*** (需要 `FinalizationRegistry`，data 是 wasm 内存中的一份拷贝)
- ***napi_get_typedarray_info*** (需要 `FinalizationRegistry`，data 是 wasm 内存中的一份拷贝)
- ***napi_get_dataview_info*** (需要 `FinalizationRegistry`，data 是 wasm 内存中的一份拷贝)

### 内存管理

#### js_native_api.h

- ***napi_adjust_external_memory*** (内部调用 `emscripten_resize_heap`, `change_in_bytes` 必须是正整数)

### 多线程相关

::: warning

这些 API 需要 Emscripten pthread 支持（`-sUSE_PTHREADS=1`），建议明确指定线程池大小（`-sPTHREAD_POOL_SIZE=4`）。

要求目标环境有 `Worker` 和 `SharedArrayBuffer` 支持。如果目标环境是浏览器，则需要

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

在响应头中。

`async_resource` 和 `async_resource_name` 参数没有效果。

:::

#### node_api.h

- ***napi_create_async_work***
- ***napi_delete_async_work***
- ***napi_queue_async_work***
- ***napi_cancel_async_work***
- ***napi_create_threadsafe_function***
- ***napi_get_threadsafe_function_context***
- ***napi_call_threadsafe_function***
- ***napi_acquire_threadsafe_function***
- ***napi_release_threadsafe_function***
- ***napi_unref_threadsafe_function***
- ***napi_ref_threadsafe_function***

## 任何时候都可用的 API

::: tip

请放心使用以下 API。

:::

#### js_native_api.h

- napi_get_last_error_info
- napi_get_undefined
- napi_get_null
- napi_get_global
- napi_get_boolean
- napi_create_object
- napi_create_array
- napi_create_array_with_length
- napi_create_double
- napi_create_int32
- napi_create_uint32
- napi_create_int64
- napi_create_string_latin1
- napi_create_string_utf8
- napi_create_string_utf16
- napi_create_symbol
- **node_api_symbol_for (NAPI_EXPERIMENTAL)**
- napi_create_function
- napi_create_error
- napi_create_type_error
- napi_create_range_error
- **node_api_create_syntax_error (NAPI_EXPERIMENTAL)**
- napi_typeof
- napi_get_value_double
- napi_get_value_int32
- napi_get_value_uint32
- napi_get_value_int64
- napi_get_value_bool
- napi_get_value_string_latin1
- napi_get_value_string_utf8
- napi_get_value_string_utf16
- napi_coerce_to_bool
- napi_coerce_to_number
- napi_coerce_to_object
- napi_coerce_to_string
- napi_get_prototype
- napi_get_property_names
- napi_set_property
- napi_has_property
- napi_get_property
- napi_delete_property
- napi_has_own_property
- napi_set_named_property
- napi_has_named_property
- napi_get_named_property
- napi_set_element
- napi_has_element
- napi_get_element
- napi_delete_element
- napi_define_properties
- napi_is_array
- napi_get_array_length
- napi_strict_equals
- napi_call_function
- napi_new_instance
- napi_instanceof
- napi_get_cb_info
- napi_get_new_target
- napi_define_class
- napi_open_handle_scope
- napi_close_handle_scope
- napi_open_escapable_handle_scope
- napi_close_escapable_handle_scope
- napi_escape_handle
- napi_throw
- napi_throw_error
- napi_throw_type_error
- napi_throw_range_error
- **node_api_throw_syntax_error (NAPI_EXPERIMENTAL)**
- napi_is_error
- napi_is_exception_pending
- napi_get_and_clear_last_exception
- napi_is_arraybuffer
- napi_is_typedarray
- napi_create_typedarray
- napi_create_dataview
- napi_is_dataview
- napi_detach_arraybuffer
- napi_is_detached_arraybuffer
- napi_get_version
- napi_create_promise
- napi_resolve_deferred
- napi_reject_deferred
- napi_is_promise
- napi_run_script
- napi_create_date
- napi_is_date
- napi_get_date_value
- napi_get_all_property_names
- napi_set_instance_data
- napi_get_instance_data
- napi_object_freeze
- napi_object_seal
- napi_type_tag_object
- napi_check_object_type_tag
- napi_unwrap
- napi_remove_wrap
- napi_get_value_external
- napi_delete_reference
- napi_reference_ref
- napi_get_reference_value

#### node_api.h

- napi_fatal_error
- napi_get_node_version

[emnapi_create_external_uint8array]: /zh/reference/additional.html#emnapi-create-external-uint8array
