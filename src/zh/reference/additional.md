# 额外新增的 API

::: tip

以下 API 声明在 `emnapi.h` 头文件中。

:::

#### emnapi_is_support_weakref

```c
int emnapi_is_support_weakref();
```

如果运行时支持 `FinalizationRegistry` 和 `WeakRef`，则返回 `1`，否则返回 `0`。

#### emnapi_is_support_bigint

```c
int emnapi_is_support_bigint();
```

如果运行时支持 `BigInt`，则返回 `1`，否则返回 `0`。

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

#### emnapi_create_external_uint8array

```c
napi_status emnapi_create_external_uint8array(napi_env env,
                                              void* external_data,
                                              size_t byte_length,
                                              napi_finalize finalize_cb,
                                              void* finalize_hint,
                                              napi_value* result);
```

* `[in] env`: The environment that the API is invoked under.
* `[in] external_data`: Pointer to the underlying byte buffer of the
  `Uint8Array`.
* `[in] byte_length`: The length in bytes of the underlying buffer.
* `[in] finalize_cb`: Optional callback to call when the `Uint8Array` is being
  collected.
* `[in] finalize_hint`: Optional hint to pass to the finalize callback during
  collection.
* `[out] result`: A `napi_value` representing a JavaScript `Uint8Array`.

Returns `napi_ok` if the API succeeded.
Returns `napi_generic_failure` if `FinalizationRegistry` or `WeakRef` is not supported.

This API returns an N-API value corresponding to a JavaScript `Uint8Array`.
The underlying byte buffer of the `Uint8Array` is externally allocated and
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
