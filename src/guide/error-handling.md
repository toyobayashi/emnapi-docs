# Error handling

The content of this section refers:

- [Node-API documentation](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#error-handling)
- [node-addon-api documentation](https://github.com/nodejs/node-addon-api/blob/v5.0.0/doc/error_handling.md)

## Node-API

### Return Values

All of the Node-API functions share the same error handling pattern. The return type of all API functions is `napi_status`.

```c
typedef enum {
  napi_ok,
  napi_invalid_arg,
  napi_object_expected,
  napi_string_expected,
  napi_name_expected,
  napi_function_expected,
  napi_number_expected,
  napi_boolean_expected,
  napi_array_expected,
  napi_generic_failure,
  napi_pending_exception,
  napi_cancelled,
  napi_escape_called_twice,
  napi_handle_scope_mismatch,
  napi_callback_scope_mismatch,
  napi_queue_full,
  napi_closing,
  napi_bigint_expected,
  napi_date_expected,
  napi_arraybuffer_expected,
  napi_detachable_arraybuffer_expected,
  napi_would_deadlock,  /* unused */
} napi_status;
```

The return value will be `napi_ok` if the request was successful and no uncaught JavaScript exception was thrown. If an error occurred **AND** an exception was thrown, the `napi_status` value for the error will be returned. If an exception was thrown, and no error occurred, `napi_pending_exception` will be returned.

In cases where a return value other than `napi_ok` or `napi_pending_exception` is returned, `napi_is_exception_pending` must be called to check if an exception is pending.

```c
napi_status napi_is_exception_pending(napi_env env, bool* result);
```

The `napi_status` return value provides a VM-independent representation of the error which occurred. In some cases it is useful to be able to get more detailed information, including a string representing the error as well as VM (engine)-specific information.

In order to retrieve this information `napi_get_last_error_info` is provided which returns a `napi_extended_error_info` structure.

```c
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```

- `error_message`: Textual representation of the error that occurred.
- `engine_reserved`: Opaque handle reserved for engine use only.
- `engine_error_code`: VM specific error code.
- `error_code`: Node-API status code for the last error.

### Last Error Info

`napi_get_last_error_info` returns the information for the last Node-API call that was made.

```c
napi_status
napi_get_last_error_info(napi_env env,
                         const napi_extended_error_info** result);
```

- `[in] env`: The environment that the API is invoked under.
- `[out] result`: The napi_extended_error_info structure with more information about the error.

This API retrieves a `napi_extended_error_info` structure with information about the last error that occurred.

The content of the `napi_extended_error_info` returned is only valid up until a Node-API function is called on the same env. This includes a call to `napi_is_exception_pending` so it may often be necessary to make a copy of the information so that it can be used later. The pointer returned in `error_message` points to a statically-defined string so it is safe to use that pointer if you have copied it out of the `error_message` field (which will be overwritten) before another Node-API function was called.

This API can be called even if there is a pending JavaScript exception.

### Helper Macro

That is why you can see that the `NAPI_CALL` macro is defined in the hello world example.

```c {21,27-29}
#define NAPI_CALL(env, the_call)                                \
  do {                                                          \
    if ((the_call) != napi_ok) {                                \
      const napi_extended_error_info *error_info;               \
      napi_get_last_error_info((env), &error_info);             \
      bool is_pending;                                          \
      const char* err_message = error_info->error_message;      \
      napi_is_exception_pending((env), &is_pending);            \
      if (!is_pending) {                                        \
        const char* error_message = err_message != NULL ?       \
          err_message :                                         \
          "empty error message";                                \
        napi_throw_error((env), NULL, error_message);           \
      }                                                         \
      return NULL;                                              \
    }                                                           \
  } while (0)

napi_value js_function(napi_env env, napi_callback_info info) {
  // ...
  NAPI_CALL(env, napi_create_string_utf8(env, str, str_len, &world));
  // ...
}

NAPI_MODULE_INIT() {
  napi_value hello;
  NAPI_CALL(env, napi_create_function(env, "hello", NAPI_AUTO_LENGTH,
                                      js_hello, NULL, &hello));
  NAPI_CALL(env, napi_set_named_property(env, exports, "hello", hello));
  return exports;
}
```

## node-addon-api

::: warning

You **can not** use node-addon-api 
if the runtime does not support `FinalizationRegistry` and `WeakRef`.

:::

C++ exception is disabled by Emscripten default, but node-addon-api use C++ exceptions by default.

To enable C++ exception, you should use `-sDISABLE_EXCEPTION_CATCHING=0`.

To tell node-addon-api disable C++ exception, you should predefine `NAPI_DISABLE_CPP_EXCEPTIONS`.

The `Napi::Error` is a persistent reference to a JavaScript error object. Use of this class depends on whether C++ exceptions are enabled at compile time.

If C++ exceptions are enabled, then the `Napi::Error` class extends `std::exception` and enables integrated error-handling for C++ exceptions and JavaScript exceptions.

The following sections explain the approach for each case:

- [Handling Errors With C++ Exceptions](#handling-errors-with-c-exceptions)
- [Handling Errors With Maybe Type and C++ Exceptions Disabled](#handling-errors-with-maybe-type-and-c-exceptions-disabled)
- [Handling Errors Without C++ Exceptions](#handling-errors-without-c-exceptions)

In most cases when an error occurs, the native code should do whatever cleanup is possible
and then return to JavaScript so that the error can be propagated.  In less frequent
cases the native code may be able to recover from the error, clear the error and then
continue.

### Handling Errors With C++ Exceptions

When C++ exceptions are enabled try/catch can be used to catch exceptions thrown
from calls to JavaScript and then they can either be handled or rethrown before
returning from a native method.

If a node-addon-api call fails without executing any JavaScript code (for example due to
an invalid argument), then node-addon-api automatically converts and throws
the error as a C++ exception of type `Napi::Error`.

If a JavaScript function called by C++ code via node-addon-api throws a JavaScript
exception, then node-addon-api automatically converts and throws it as a C++
exception of type `Napi::Error` on return from the JavaScript code to the native
method.

If a C++ exception of type `Napi::Error` escapes from a Node-API C++ callback, then
the Node-API wrapper automatically converts and throws it as a JavaScript exception.

On return from a native method, node-addon-api will automatically convert a pending C++
exception to a JavaScript exception.

### Examples with C++ exceptions enabled

#### Throwing a C++ exception

```cpp
Env env = ...
throw Napi::Error::New(env, "Example exception");
// other C++ statements
// ...
```

The statements following the throw statement will not be executed. The exception
will bubble up as a C++ exception of type `Napi::Error`, until it is either caught
while still in C++, or else automatically propagated as a JavaScript exception
when returning to JavaScript.

#### Propagating a Node-API C++ exception

```cpp
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Napi::Value result = jsFunctionThatThrows({ arg1, arg2 });
// other C++ statements
// ...
```

The C++ statements following the call to the JavaScript function will not be
executed. The exception will bubble up as a C++ exception of type `Napi::Error`,
until it is either caught while still in C++, or else automatically propagated as
a JavaScript exception when returning to JavaScript.

#### Handling a Node-API C++ exception

```cpp
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Napi::Value result;
try {
    result = jsFunctionThatThrows({ arg1, arg2 });
} catch (const Napi::Error& e) {
    cerr << "Caught JavaScript exception: " + e.what();
}
```

Since the exception was caught here, it will not be propagated as a JavaScript
exception.

### Handling Errors With Maybe Type and C++ Exceptions Disabled

If you decide to use node-addon-api without C++ exceptions enabled, please consider enabling node-addon-api safe API type guards by predefining `NODE_ADDON_API_ENABLE_MAYBE` to ensure the proper exception handling pattern.

If C++ exceptions are disabled, then the
`Napi::Error` class does not extend `std::exception`. This means that any calls to
node-addon-api functions do not throw a C++ exceptions. Instead, these node-api
functions that call into JavaScript are returning with `Maybe` boxed values.
In that case, the calling side should convert the `Maybe` boxed values with
checks to ensure that the call did succeed and therefore no exception is pending.
If the check fails, that is to say, the returning value is _empty_, the calling
side should determine what to do with `env.GetAndClearPendingException()` before
attempting to call another node-api.

The conversion from the `Maybe` boxed value to the actual return value is
enforced by compilers so that the exceptions must be properly handled before
continuing.

### Examples with Maybe Type and C++ exceptions disabled

#### Throwing a JS exception

```cpp
Napi::Env env = ...
Napi::Error::New(env, "Example exception").ThrowAsJavaScriptException();
return;
```

After throwing a JavaScript exception, the code should generally return
immediately from the native callback, after performing any necessary cleanup.

#### Propagating a Node-API JS exception

```cpp
Napi::Env env = ...
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Maybe<Napi::Value> maybeResult = jsFunctionThatThrows({ arg1, arg2 });
Napi::Value result;
if (!maybeResult.To(&result)) {
    // The Maybe is empty, calling into js failed, cleaning up...
    // It is recommended to return an empty Maybe if the procedure failed.
    return result;
}
```

If `maybeResult.To(&result)` returns false a JavaScript exception is pending.
To let the exception propagate, the code should generally return immediately
from the native callback, after performing any necessary cleanup.

#### Handling a Node-API JS exception

```cpp
Napi::Env env = ...
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Maybe<Napi::Value> maybeResult = jsFunctionThatThrows({ arg1, arg2 });
if (maybeResult.IsNothing()) {
    Napi::Error e = env.GetAndClearPendingException();
    cerr << "Caught JavaScript exception: " + e.Message();
}
```

Since the exception was cleared here, it will not be propagated as a JavaScript
exception after the native callback returns.

### Handling Errors Without C++ Exceptions

If C++ exceptions are disabled, then the
`Napi::Error` class does not extend `std::exception`. This means that any calls to
node-addon-api function do not throw a C++ exceptions. Instead, it raises
_pending_ JavaScript exceptions and returns an _empty_ `Napi::Value`.
The calling code should check `env.IsExceptionPending()` before attempting to use a
returned value, and may use methods on the `Napi::Env` class
to check for, get, and clear a pending JavaScript exception.
If the pending exception is not cleared, it will be thrown when the native code
returns to JavaScript.

### Examples with C++ exceptions disabled

#### Throwing a JS exception

```cpp
Napi::Env env = ...
Napi::Error::New(env, "Example exception").ThrowAsJavaScriptException();
return;
```

After throwing a JavaScript exception, the code should generally return
immediately from the native callback, after performing any necessary cleanup.

### Propagating a Node-API JS exception

```cpp
Napi::Env env = ...
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Napi::Value result = jsFunctionThatThrows({ arg1, arg2 });
if (env.IsExceptionPending()) {
    Error e = env.GetAndClearPendingException();
    return e.Value();
}
```

If `env.IsExceptionPending()` returns true a JavaScript exception is pending. To
let the exception propagate, the code should generally return immediately from
the native callback, after performing any necessary cleanup.

#### Handling a Node-API JS exception

```cpp
Napi::Env env = ...
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Napi::Value result = jsFunctionThatThrows({ arg1, arg2 });
if (env.IsExceptionPending()) {
    Napi::Error e = env.GetAndClearPendingException();
    cerr << "Caught JavaScript exception: " + e.Message();
}
```

Since the exception was cleared here, it will not be propagated as a JavaScript
exception after the native callback returns.

### Calling Node-API directly

**node-addon-api** provides macros for throwing errors in response to non-OK
`napi_status` results when calling Node-API
functions. These macros are defined differently
depending on whether C++ exceptions are enabled or not, but are available for
use in either case.

#### `NAPI_THROW(e, ...)`

This macro accepts a `Napi::Error`, throws it, and returns the value given as
the last parameter. If C++ exceptions are enabled (by defining
`NAPI_CPP_EXCEPTIONS` during the build), the return value will be ignored.

#### `NAPI_THROW_IF_FAILED(env, status, ...)`

This macro accepts a `Napi::Env` and a `napi_status`. It constructs an error
from the `napi_status`, throws it, and returns the value given as the last
parameter. If C++ exceptions are enabled (by defining `NAPI_CPP_EXCEPTIONS`
during the build), the return value will be ignored.

#### `NAPI_THROW_IF_FAILED_VOID(env, status)`

This macro accepts a `Napi::Env` and a `napi_status`. It constructs an error
from the `napi_status`, throws it, and returns.

#### `NAPI_FATAL_IF_FAILED(status, location, message)`

This macro accepts a `napi_status`, a C string indicating the location where the
error occurred, and a second C string for the message to display.
