# Additional APIs

::: tip

These APIs are in `emnapi.h`.

:::

#### emnapi_is_support_weakref

```c
int emnapi_is_support_weakref();
```

Returns `1` if the runtime support `FinalizationRegistry` and `WeakRef`, else returns `0`.

#### emnapi_is_support_bigint

```c
int emnapi_is_support_bigint();
```

Returns `1` if the runtime support `BigInt`, else returns `0`.

#### emnapi_get_module_object

```c
napi_status emnapi_get_module_object(napi_env env,
                                     napi_value* result);
```

* `[in] env`: The environment that the API is invoked under.
* `[out] result`: A `napi_value` representing the `Module` object of Emscripten.

Returns `napi_ok` if the API succeeded.

#### emnapi_get_module_property

```c
napi_status emnapi_get_module_property(napi_env env,
                                       const char* utf8name,
                                       napi_value* result);
```

* `[in] env`: The environment that the API is invoked under.
* `[in] utf8Name`: The name of the `Module` property to get.
* `[out] result`: The value of the property.

Returns `napi_ok` if the API succeeded.

#### emnapi_create_memory_view

```c
typedef enum {
  emnapi_int8_array,
  emnapi_uint8_array,
  emnapi_uint8_clamped_array,
  emnapi_int16_array,
  emnapi_uint16_array,
  emnapi_int32_array,
  emnapi_uint32_array,
  emnapi_float32_array,
  emnapi_float64_array,
  emnapi_bigint64_array,
  emnapi_biguint64_array,
  emnapi_data_view = -1,
  emnapi_buffer = -2,
} emnapi_memory_view_type;

napi_status emnapi_create_memory_view(napi_env env,
                                      emnapi_memory_view_type type,
                                      void* external_data,
                                      size_t byte_length,
                                      napi_finalize finalize_cb,
                                      void* finalize_hint,
                                      napi_value* result);
```

* `[in] env`: The environment that the API is invoked under.
* `[in] type`: The view type.
* `[in] external_data`: Pointer to the underlying byte buffer of the
  `ArrayBufferView`.
* `[in] byte_length`: The length in bytes of the underlying buffer.
* `[in] finalize_cb`: Optional callback to call when the `ArrayBufferView` is being
  collected.
* `[in] finalize_hint`: Optional hint to pass to the finalize callback during
  collection.
* `[out] result`: A `napi_value` representing a JavaScript `ArrayBufferView`.

Returns `napi_ok` if the API succeeded.
Returns `napi_generic_failure` if `FinalizationRegistry` or `WeakRef` is not supported.

This API returns an N-API value corresponding to a JavaScript `ArrayBufferView`.
The underlying byte buffer of the `ArrayBufferView` is externally allocated and
managed. The caller must ensure that the byte buffer remains valid until the
finalize callback is called.

#### emnapi_get_emscripten_version

```c
typedef struct {
  uint32_t major;
  uint32_t minor;
  uint32_t patch;
} emnapi_emscripten_version;

napi_status emnapi_get_emscripten_version(napi_env env,
                                          const emnapi_emscripten_version** version);
```

* `[in] env`: The environment that the API is invoked under.
* `[out] version`: A pointer to version information for Emscripten itself.

Returns `napi_ok` if the API succeeded.

This function fills the version struct with the major, minor, and patch version of Emscripten that is used for compiling current wasm module. 

The returned buffer does not need to be freed.

#### emnapi_sync_memory

```c
napi_status emnapi_sync_memory(napi_env env,
                               bool js_to_wasm,
                               napi_value* arraybuffer_or_view,
                               size_t byte_offset,
                               size_t length);
```

* `[in] env`: The environment that the API is invoked under.
* `[in] js_to_wasm`: The direction of memory sync.
* `[in-out] arraybuffer_or_view`: The latest `ArrayBuffer` or `ArrayBufferView`
* `[in] byte_offset`
* `[in] length`

#### emnapi_get_memory_address

```c
napi_status emnapi_get_memory_address(napi_env env,
                                      napi_value arraybuffer_or_view,
                                      void** address,
                                      emnapi_ownership* ownership,
                                      bool* runtime_allocated);
```

* `[in] env`
* `[in] arraybuffer_or_view`
* `[out] address`
* `[out] ownership`
* `[out] runtime_allocated`
