---
sidebarDepth: 3
---

# API List

## Unavailable

::: danger

These APIs don't exist.

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

## Limited

### Reference related

::: warning

These APIs require [FinalizationRegistry](https://www.caniuse.com/?search=FinalizationRegistry) and [WeakRef](https://www.caniuse.com/?search=WeakRef) (v8 engine v8.4+ / Node.js v14.6.0+), if the runtime does not support, passing `finalize_cb` will cause an error. Only `Object` and  `Function` can be referenced, `Symbol` is not support.

:::

#### js_native_api.h

- ***napi_wrap***
- ***napi_unwrap***
- ***napi_remove_wrap***
- ***napi_create_external***
- ***napi_get_value_external***
- ***napi_create_reference***
- ***napi_delete_reference***
- ***napi_reference_ref***
- ***napi_reference_unref***
- ***napi_get_reference_value***
- ***napi_add_finalizer***

### BigInt related

::: warning

These APIs require [BigInt](https://www.caniuse.com/?search=BigInt) (v8 engine v6.7+ / Node.js v10.4.0+), throw error if the runtime does not support.

:::

#### js_native_api.h

- ***napi_create_bigint_int64***
- ***napi_create_bigint_uint64***
- ***napi_create_bigint_words***
- ***napi_get_value_bigint_int64***
- ***napi_get_value_bigint_uint64***
- ***napi_get_value_bigint_words***

### ArrayBuffer related

::: warning

These APIs may return `NULL` data pointer

:::

#### js_native_api.h

- ***napi_create_arraybuffer*** (`data` is always `NULL`, no way to implement in JS)
- ***napi_get_arraybuffer_info*** (Require `FinalizationRegistry`, data is a copy in wasm memory)
- ***napi_get_typedarray_info*** (Require `FinalizationRegistry`, data is a copy in wasm memory)
- ***napi_get_dataview_info*** (Require `FinalizationRegistry`, data is a copy in wasm memory)

### Memory management

#### js_native_api.h

- ***napi_adjust_external_memory*** (call `emscripten_resize_heap` internally, `change_in_bytes` must be a positive integer)

### Multithread related

::: warning

These APIs added in emnapi v0.15.0 require Emscripten pthread support (`-sUSE_PTHREADS=1`), also recommand to specifying thread pool size explicitly (`-sPTHREAD_POOL_SIZE=4`).

Require target environment has `Worker` and `SharedArrayBuffer` support. If target environment is browser, require

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

in response headers.

The `async_resource` and `async_resource_name` parameter have no effect.

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

## Stable

::: tip

These APIs are stable!

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

#### node_api.h

- napi_fatal_error
- napi_get_node_version

[emnapi_create_external_uint8array]: /reference/additional.html#emnapi-create-external-uint8array
