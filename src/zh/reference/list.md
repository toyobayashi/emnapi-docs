---
sidebarDepth: 4
---

# API 列表

## 不可用的 API

::: danger

以下 API 不存在。

:::

#### node_api.h

- ~~napi_module_register~~
- ~~napi_open_callback_scope~~
- ~~napi_close_callback_scope~~

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

|  API   | 内存复制发生的条件 | `data` 复制方向 | `data` 所有权 |
|  ----  | ----  | ----  | ----  |
| `napi_create_arraybuffer` | 用户请求返回 `data` | `从 JS 到 WASM` | 如果发生了内存复制，且运行时支持 `FinalizationRegistry`，则由 `emnapi` 管理，否则用户需要手动释放 `data` 内存 |
| `napi_create_external_arraybuffer` | 总是复制 | `从 WASM 到 JS` | 用户 |
| `napi_get_arraybuffer_info` | (用户请求返回 `data`) `&&` (ArrayBuffer 不是由 emnapi 创建的 `\|\|` 由 `napi_create_arraybuffer` 创建但用户未请求返回 `data`) | `从 JS 到 WASM` | 如果发生了内存复制，规则与 `napi_create_arraybuffer` 相同 |
| `napi_get_typedarray_info` <br/><br/> `napi_get_dataview_info` <br/><br/> `napi_get_buffer_info` (`node_api.h`) | (用户请求返回 `data`) `&&` (不是 wasm 内存视图) `&&` (`napi_get_arraybuffer_info` 规则同样适用于它的 ArrayBuffer) | `从 JS 到 WASM` | 如果发生了内存复制，规则与 `napi_create_arraybuffer` 相同 |
| `napi_create_buffer` | 不会发生复制。如果用户请求返回 `data`，则新分配内存然后直接从这块内存创建 Buffer 视图，否则用 `Buffer.alloc` 创建 Buffer |  | 如果用户请求返回 `data`，规则与 `napi_create_arraybuffer` 相同 |
| `napi_create_external_buffer` | 不会发生复制。从 `data` 地址直接创建 Buffer 视图 |  | 用户 |

你可以使用 `emnapi_sync_memory` 或导出运行时方法 `emnapiSyncMemory` 来同步 wasm 和 JS 的内存。当 wasm 内存增长或单边内存变化时，它是必要的。

```c
#include <emnapi.h>

napi_status emnapi_sync_memory(napi_env env,
                               bool js_to_wasm,
                               napi_value* arraybuffer_or_view,
                               size_t byte_offset,
                               size_t length);

void finalizer(napi_env env, void* finalize_data, void* finalize_hint) {
   free(finalize_data);
}

napi_value createExternalArraybuffer(napi_env env, napi_callback_info info) {
  uint8_t* external_data = malloc(3);
  external_data[0] = 0;
  external_data[1] = 1;
  external_data[2] = 2;
  napi_value array_buffer;
  napi_create_external_arraybuffer(env, external_data, 3, finalizer, NULL, &array_buffer);

  external_data[0] = 3; // JavaScript ArrayBuffer 内存不会改变
  emnapi_sync_memory(env, false, array_buffer, 0, NAPI_AUTO_LENGTH);
  // 同步后，new Uint8Array(array_buffer)[0] === 3

  return array_buffer;
}
```

```js
declare function emnapiSyncMemory (
  jsToWasm: boolean,
  arrayBufferOrView: ArrayBuffer | ArrayBufferView,
  byteOffset?: number,
  length?: number
): void

const array_buffer = Module.emnapiExports.createExternalArraybuffer()
new Uint8Array(array_buffer)[1] === 4
Module.emnapiSyncMemory(true, array_buffer)
```

你可以使用 `emnapi_get_memory_address` 或导出运行时方法 `emnapiGetMemoryAddress` 来检查内存是否需要由你来手动释放。

```c
#include <emnapi.h>

void* data;
napi_get_typedarray_info(env, typedarray, NULL, NULL, &data, NULL, NULL);

void* address;
emnapi_ownership ownership;
bool runtime_allocated;
emnapi_get_memory_address(env, typedarray, &address, &ownership, &runtime_allocated);
assert(address == data);
if (data != NULL && runtime_allocated && ownership == emnapi_userland) {
  // 用户需要手动释放内存
  // free(data);
}
```

::: warning

`emnapi_get_memory_address` 对 wasm 内存视图可能会返回错误的 `ownership` 和 `runtime_allocated`。比如说，你使用 `napi_create_arraybuffer` 创建了一个 `ArrayBbuffer` 并且请求了返回 `data` 地址，然后用 `napi_create_external_buffer` 从 `data` 创建了一个视图。

:::

### Buffer 相关

::: warning

以下 API 需要 `globalThis.Buffer`，否则将返回 `napi_invalid_arg` 或 `napi_pending_exception`。

如果你想在浏览器中使用它们，你可以引入 [feross/buffer](https://github.com/feross/buffer)。

:::

- ***napi_create_buffer***
- ***napi_create_external_buffer***
- ***napi_create_buffer_copy***
- ***napi_is_buffer***
- ***napi_get_buffer_info***

### 清理钩子相关

::: tip

清理钩子会被添加在 `Context` 上，当 `Context` dispose 时它们会被调用。

特别地，在 Node.js 环境中，`Context.prototype.dispose` 会在 process `beforeExit` 事件中自动调用。

:::

#### node_api.h

- ***napi_add_env_cleanup_hook***
- ***napi_remove_env_cleanup_hook***
- ***napi_add_async_cleanup_hook***
- ***napi_remove_async_cleanup_hook***

### 内存管理

#### js_native_api.h

- ***napi_adjust_external_memory*** (`change_in_bytes` 必须是正整数)

### Node.js 上的异步操作

#### node_api.h

::: warning

以下 API 仅在 Node.js 运行时支持，并且需要 `@emnapi/node-binding` 并在调用 `emnapiInit` 时传入。

:::

- ***napi_async_init***
- ***napi_async_destroy***
- ***napi_make_callback***


### 多线程相关

::: warning

这些 API 需要 Emscripten pthread 支持（`-sUSE_PTHREADS=1`），建议明确指定线程池大小（`-sPTHREAD_POOL_SIZE=4`）。wasi-sdk 暂未支持多线程。

要求目标环境有 `Worker` 和 `SharedArrayBuffer` 支持。如果目标环境是浏览器，则需要

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

在响应头中。

`async_resource` 和 `async_resource_name` 参数在浏览器环境中没有效果，仅在 Node.js 运行时支持，并且需要 `@emnapi/node-binding` 并在调用 `emnapiInit` 时传入。

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

### Other API

#### node_api.h

- ***napi_get_uv_event_loop***: 如果启用了 pthread，则返回线程池相关函数使用的假 `uv_loop_t`。
- ***napi_fatal_exception***: 在 Node.js 环境中调用 `process._fatalException`。在非 Node.js 环境中返回 `napi_generic_failure`。
- ***node_api_get_module_file_name***: 返回 `Module.emnapiInit({ context, filename })` 传入的 filename。

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
