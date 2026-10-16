---
sidebarDepth: 4
---

# API List

This reference describes emnapi 2.0.0-beta.2. The bundled Node-API headers support versions 1 through 10; NAPI_VERSION defaults to 8 unless you set it explicitly.


## Unavailable

::: danger

These APIs are unavailable, throws JavaScript Error.

:::

#### node_api.h

- ~~napi_open_callback_scope~~
- ~~napi_close_callback_scope~~

## Limited

### Reference related

::: warning

If the runtime does not support [FinalizationRegistry](https://www.caniuse.com/?search=FinalizationRegistry) and [WeakRef](https://www.caniuse.com/?search=WeakRef), The following APIs have some limitations, and all references are strong references no matter their reference count is 0 or not.

:::

#### js_native_api.h

- ***napi_wrap***: `finalize_cb` and `result` must be `NULL`, user must call `napi_remove_wrap` later
- ***napi_create_external***: `finalize_cb` must be `NULL`
- ***napi_create_reference***: Create strong reference even if `0` is passed to `initial_refcount`
- ***napi_reference_unref***: The reference is still a strong reference even the count is `0`
- ***napi_add_finalizer***: Requires FinalizationRegistry and WeakRef; returns napi_generic_failure when the runtime does not support them

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

|  API   | Condition of memory copy happening | `data` memory copy direction | `data` memory ownership |
|  ----  | ----  | ----  | ----  |
| `napi_create_arraybuffer` | user request `data` | `JS to WASM` | if copy happens, managed by `emnapi` if runtime support `FinalizationRegistry`, otherwise `user` should manually free returned `data` pointer |
| `napi_create_external_arraybuffer` | always | `WASM to JS` | `user` |
| `napi_get_arraybuffer_info` | (user request `data`) `&&` (ArrayBuffer not created by emnapi `\|\|` created by `napi_create_arraybuffer` but not request `data`) | `JS to WASM` | if copy happens, same rule as `napi_create_arraybuffer` |
| `napi_get_typedarray_info` <br/><br/> `napi_get_dataview_info` <br/><br/> `napi_get_buffer_info` (`node_api.h`) | (user request `data`) `&&` (not wasm memory view) `&&` (same rule of `napi_get_arraybuffer_info` for its ArrayBuffer) | `JS to WASM` | if copy happens, same rule as `napi_create_arraybuffer` |
| `napi_create_buffer` | Never copy. if user request `data`, allocate memory and create a Buffer from wasm memory of this address, otherwise create a Buffer by `Buffer.alloc` |  | if user request `data`, same rule as `napi_create_arraybuffer` |
| `napi_create_external_buffer` | Never copy. Create a Buffer from wasm memory of `data` address |  | `user` |

Use the C API emnapi_sync_memory to synchronize copied ArrayBuffer data. When loading through @emnapi/core, JavaScript can call addonModule.emnapi.syncMemory. Synchronize after wasm memory grows or copied memory changes.

~~~c
#include <emnapi.h>
#include <stdint.h>
#include <stdlib.h>

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

  external_data[0] = 3;
  emnapi_sync_memory(env, false, &array_buffer, 0, NAPI_AUTO_LENGTH);
  // After synchronization, JavaScript observes the updated byte.

  return array_buffer;
}
~~~

```js
import { instantiateAddon } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'

const { addonModule } = await instantiateAddon(wasmBytes, {
  context: createContext()
})
const binding = addonModule.exports
const array_buffer = binding.createExternalArraybuffer()
new Uint8Array(array_buffer)[1] = 4
addonModule.emnapi.syncMemory(true, array_buffer)
```

You can use `emnapi_get_memory_address` or export runtime method `emnapiGetMemoryAddress` to check if the memory should be released manually.

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
  // user should free data
  // free(data);
}
```

::: warning

`emnapi_get_memory_address` on wasm memory views may return wrong `ownership` and `runtime_allocated`. For example, you created an `ArrayBuffer` by using `napi_create_arraybuffer` and requested a copied `data`, then use `napi_create_external_buffer` to create a view from the `data`.

:::

### Buffer related

::: warning

These APIs require `globalThis.Buffer`, otherwise return `napi_invalid_arg` or `napi_pending_exception`.

If you would use them in browsers, you can use [feross/buffer](https://github.com/feross/buffer).

:::

- ***napi_create_buffer***
- ***napi_create_external_buffer***
- ***napi_create_buffer_copy***
- ***napi_is_buffer***
- ***napi_get_buffer_info***

### Cleanup hook related

::: tip

Cleanup hooks are attached to Context and run when Context.destroy() is called.

On Node.js, Context.destroy() is called automatically on the process beforeExit event unless Context.suppressDestroy() was called.

:::

#### node_api.h

- ***napi_add_env_cleanup_hook***
- ***napi_remove_env_cleanup_hook***
- ***napi_add_async_cleanup_hook***
- ***napi_remove_async_cleanup_hook***

### Memory management

#### js_native_api.h

- ***napi_adjust_external_memory*** (`change_in_bytes` must be a positive integer)

### Asynchronous operation on Node.js

#### node_api.h

::: warning

These APIs only work on Node.js and require `@emnapi/node-binding` when calling `emnapiInit`.

:::

- ***napi_async_init***
- ***napi_async_destroy***
- ***napi_make_callback***

### Multithread related

::: warning

The threaded C implementation uses emnapi-mt with Emscripten pthreads or wasm32-wasip1-threads. A plain wasm32-wasip1 build can use the JavaScript async-work and thread-safe-function implementations from @emnapi/core.

Browser deployments that use workers and shared memory require Worker and SharedArrayBuffer support. Serve these response headers:

~~~
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
~~~

The async_resource and async_resource_name parameters have no effect in browsers. They work only on Node.js and require @emnapi/node-binding when passed to emnapiInit.

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

- ***napi_get_uv_event_loop***: Returns fake `uv_loop_t` used by thread pool related functions if pthread is enabled.
- ***napi_fatal_exception***: Calls `process._fatalException` on Node.js. Returns `napi_generic_failure` on non-Node.js environment.
- ***node_api_get_module_file_name***: Returns the filename which is passed to `Module.emnapiInit({ context, filename })`.

## Available Anytime

::: tip

Feel free to use the following APIs.

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
- napi_create_function
- napi_create_error
- napi_create_type_error
- napi_create_range_error
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

## Versioned and Experimental APIs

### Node-API version 9

These APIs are available when compiling with NAPI_VERSION 9 or later:

- node_api_symbol_for
- node_api_create_syntax_error
- node_api_throw_syntax_error
- node_api_get_module_file_name

### Node-API version 10

These APIs are available when compiling with NAPI_VERSION 10 or later:

- node_api_create_buffer_from_arraybuffer
- node_api_create_external_string_latin1
- node_api_create_external_string_utf16
- node_api_create_property_key_latin1
- node_api_create_property_key_utf8
- node_api_create_property_key_utf16

### NAPI_EXPERIMENTAL

The following declarations are guarded by NAPI_EXPERIMENTAL in the bundled headers and have implementations in emnapi 2.0.0-beta.2:

- node_api_create_object_with_properties
- node_api_set_prototype
- node_api_create_sharedarraybuffer
- node_api_is_sharedarraybuffer
- node_api_create_external_sharedarraybuffer
- node_api_post_finalizer

SharedArrayBuffer APIs also require the runtime to support SharedArrayBuffer. Other declarations guarded by NAPI_EXPERIMENTAL in the headers are not listed here unless emnapi has an implementation.


[emnapi_create_external_uint8array]: /v2/reference/additional.html#emnapi-create-external-uint8array
