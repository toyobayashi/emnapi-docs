# API 列表

## 不可用的 API

::: danger

以下 API 无法实现，调用后将永远返回 `napi_generic_failure` 状态。

:::

- ~~napi_create_external_arraybuffer~~ (use [emnapi_create_external_uint8array][] instead)
- ~~napi_adjust_external_memory~~
- ~~napi_detach_arraybuffer~~
- ~~napi_is_detached_arraybuffer~~

## 受限的 API

::: warning

以下 API 需要 [FinalizationRegistry](https://www.caniuse.com/?search=FinalizationRegistry) 和 [WeakRef](https://www.caniuse.com/?search=WeakRef) (v8 引擎 v8.4+ / Node.js v14.6.0+)，否则返回 `napi_generic_failure` 状态。只有 `Object` 和  `Function` 可以被引用，不支持 `Symbol`。

:::

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

::: warning

以下 API 需要 [BigInt](https://www.caniuse.com/?search=BigInt) (v8 引擎 v6.7+ / Node.js v10.4.0+)，否则返回 `napi_generic_failure` 状态。

:::

- ***napi_create_bigint_int64***
- ***napi_create_bigint_uint64***
- ***napi_create_bigint_words***
- ***napi_get_value_bigint_int64***
- ***napi_get_value_bigint_uint64***
- ***napi_get_value_bigint_words***

::: warning

`data` 指针返回值可能为 `NULL` 的 API：

:::

- ***napi_create_arraybuffer*** (JS 无法实现)
- ***napi_get_arraybuffer_info*** (需要 `FinalizationRegistry`，data 是 wasm 内存中的一份拷贝)
- ***napi_get_typedarray_info*** (需要 `FinalizationRegistry`，data 是 wasm 内存中的一份拷贝)
- ***napi_get_dataview_info*** (需要 `FinalizationRegistry`，data 是 wasm 内存中的一份拷贝)

## 稳定的 API

::: tip

以下 API 稳定可用！

:::

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
- napi_fatal_error (`node_api.h`)
- napi_get_node_version (`node_api.h`)

[emnapi_create_external_uint8array]: /zh/reference/additional.html#emnapi-create-external-uint8array