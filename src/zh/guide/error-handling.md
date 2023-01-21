# 错误处理

本节内容参考：

- [Node-API 文档](https://nodejs.org/dist/v16.15.0/docs/api/n-api.html#error-handling)
- [node-addon-api 文档](https://github.com/nodejs/node-addon-api/blob/v5.0.0/doc/error_handling.md)

## Node-API

### 返回值

所有 Node-API 函数共享相同的错误处理模式。所有 API 函数的返回类型都是 `napi_status`。

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

如果请求成功并且没有抛出未捕获的 JavaScript 异常，则返回值将为 `napi_ok`。如果发生错误**并**抛出异常，则将返回错误的 `napi_status` 值。如果抛出异常并且没有发生错误，则将返回 `napi_pending_exception`。

在返回 `napi_ok` 或 `napi_pending_exception` 以外的返回值的情况下，必须调用 `napi_is_exception_pending` 来检查是否存在异常未处理。

```c
napi_status napi_is_exception_pending(napi_env env, bool* result);
```

`napi_status` 返回值提供了与 VM 无关的错误表示。在某些情况下，能够获取更详细的信息很有用，包括表示错误的字符串以及特定于 VM（引擎）的信息。

`napi_get_last_error_info` 用于接收此信息，它返回一个 `napi_extended_error_info` 结构。

```c
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```

- `error_message`：发生的错误的文本表示。
- `engine_reserved`：保留仅供引擎使用的不透明指针。
- `engine_error_code`：VM 特定的错误代码。
- `error_code`：Node-API 最后一个错误的状态代码。

### 最后一次的错误信息

`napi_get_last_error_info` 返回最后一次 Node-API 调用的信息。

```c
napi_status
napi_get_last_error_info(napi_env env,
                         const napi_extended_error_info** result);
```

- `[in] env`: 调用 API 的环境。
- `[out] result`: napi_extended_error_info 结构，包含有关错误的更多信息。

此 API 检索 `napi_extended_error_info` 结构，其中包含有关发生的最后一个错误的信息。

返回的 `napi_extended_error_info` 的内容仅在同一环境上调用 Node-API 函数之前有效。这包括对 `napi_is_exception_pending` 的调用，因此可能经常需要复制信息以便以后使用。 `error_message` 中返回的指针指向一个静态定义的字符串，因此如果在调用另一个 Node-API 函数之前将它从 `error_message` 字段（将被覆盖）中复制出来，那么使用该指针是安全的。

即使存在未处理的 JavaScript 异常，也可以调用此 API。

### 辅助宏

这就是为什么可以看到在 hello world 示例中定义了 `NAPI_CALL` 宏。

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

如果运行时不支持 `FinalizationRegistry` 和 `WeakRef`则**不能**使用 node-addon-api。

:::

Emscripten 默认禁用 C++ 异常，但 node-addon-api 默认使用 C++ 异常。

要启用 C++ 异常，应该使用 `-sDISABLE_EXCEPTION_CATCHING=0`。

要告诉 node-addon-api 禁用 C++ 异常，应该预定义 `NAPI_DISABLE_CPP_EXCEPTIONS`。

`Napi::Error` 是对 JavaScript 错误对象的持久引用。此类的使用方式取决于是否在编译时启用了 C++ 异常。

如果启用了 C++ 异常，则 `Napi::Error` 类继承 `std::exception` 并启用对 C++ 异常和 JavaScript 异常的集成错误处理。

以下部分解释了每种情况的做法：

- [在启用 C++ 异常的情况下处理错误](#在启用-c-异常的情况下处理错误)
- [在禁用 C++ 异常的情况下使用 Maybe 类型处理错误](#在禁用-c-异常的情况下使用-maybe-类型处理错误)
- [在禁用 C++ 异常的情况下处理错误](#在禁用-c-异常的情况下处理错误)

在大多数情况下，当发生错误时，原生代码应该做任何可能的清理工作，然后返回到 JavaScript 以便可以传播错误。
在不太常见的情况下，原生代码也许能够从错误中恢复，清除错误然后继续。

### 在启用 C++ 异常的情况下处理错误

当启用 C++ 异常时，try/catch 可用于捕获从调用 JavaScript 抛出的异常，然后可以在从原生函数返回之前对其进行处理或重新抛出。

如果 node-addon-api 调用失败而没有执行任何 JavaScript 代码（例如由于无效参数），则 node-addon-api 会自动转换并将错误作为 `Napi::Error` 类型的 C++ 异常抛出。

如果 C++ 代码通过 node-addon-api 调用的 JavaScript 函数抛出 JavaScript 异常，则 node-addon-api 在从 JavaScript 代码返回到原生函数时自动将其转换为 `Napi::Error` 类型的 C++ 异常并抛出。

如果 `Napi::Error` 类型的 C++ 异常从 Node-API C++ 回调中逃逸，则 Node-API 包装器会自动将其转换为 JavaScript 异常并将其抛出。

从原生函数返回时，node-addon-api 将自动将待处理的 C++ 异常转换为 JavaScript 异常。

### 启用 C++ 异常的例子

#### 抛出 C++ 异常

```cpp
Env env = ...
throw Napi::Error::New(env, "Example exception");
// 其他 C++ 语句
// ...
```

throw 语句后面的语句将不会被执行。该异常将作为 `Napi::Error` 类型的 C++ 异常冒泡，直到它在仍在C++ 中时被捕获，或者在返回 JavaScript 时作为JavaScript 异常自动传播。

#### 传播 Node-API C++ 异常

```cpp
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Napi::Value result = jsFunctionThatThrows({ arg1, arg2 });
// 其他 C++ 语句
// ...
```

调用 JavaScript 函数之后的 C++ 语句将不会被执行。该异常将作为 `Napi::Error` 类型的 C++ 异常冒泡，直到它仍然在 C++ 中时被捕获，或者在返回 JavaScript 时作为 JavaScript 异常自动传播。

#### 处理 Node-API C++ 异常

```cpp
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Napi::Value result;
try {
    result = jsFunctionThatThrows({ arg1, arg2 });
} catch (const Napi::Error& e) {
    cerr << "Caught JavaScript exception: " + e.what();
}
```

由于在此处捕获了异常，因此不会将其作为 JavaScript 异常传播。

### 在禁用 C++ 异常的情况下使用 Maybe 类型处理错误

如果你决定在未启用 C++ 异常的情况下使用 node-addon-api，请考虑通过预定义 `NODE_ADDON_API_ENABLE_MAYBE` 来启用 node-addon-api 安全 API 类型保护，以确保正确的异常处理模式。

如果禁用 C++ 异常，则 `Napi::Error` 类不会继承 `std::exception`。这意味着对 node-addon-api 函数的任何调用都不会抛出 C++ 异常。相反，这些调用 JavaScript 的 node-api 函数返回的是 `Maybe` 装箱的值。在这种情况下，调用方应该通过检查转换 `Maybe` 装箱的值，以确保调用确实成功且没有异常未处理。如果检查失败，即返回值为*空*，调用方应在尝试调用另一个 node-api 之前确定如何处理 `env.GetAndClearPendingException()`。

从 `Maybe` 装箱值到实际返回值的转换由编译器强制执行，因此在继续之前必须正确处理异常。

### 禁用 C++ 异常并使用 Maybe 类型的例子

#### 抛出 JS 异常

```cpp
Napi::Env env = ...
Napi::Error::New(env, "Example exception").ThrowAsJavaScriptException();
return;
```

抛出 JavaScript 异常后，代码通常应在执行任何必要的清理后立即从原生回调中返回。

#### 传播 Node-API JS 异常

```cpp
Napi::Env env = ...
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Maybe<Napi::Value> maybeResult = jsFunctionThatThrows({ arg1, arg2 });
Napi::Value result;
if (!maybeResult.To(&result)) {
    // Maybe 是空的，调用 JS 失败，清理 ...
    // 建议返回一个空的 Maybe。
    return result;
}
```

如果 `maybeResult.To(&result)` 返回 false，则 JavaScript 异常处于未处理状态。
为了让异常传播，代码通常应该在执行任何必要的清理之后立即从原生回调中返回。

#### 处理 Node-API JS 异常

```cpp
Napi::Env env = ...
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Maybe<Napi::Value> maybeResult = jsFunctionThatThrows({ arg1, arg2 });
if (maybeResult.IsNothing()) {
    Napi::Error e = env.GetAndClearPendingException();
    cerr << "Caught JavaScript exception: " + e.Message();
}
```

由于这里清除了异常，所以在原生回调返回后不会作为 JavaScript 异常传播。

### 在禁用 C++ 异常的情况下处理错误

如果禁用 C++ 异常，则 `Napi::Error` 类不会继承 `std::exception`。这意味着对 node-addon-api 函数的任何调用都不会抛出 C++ 异常。相反，它会引发*待处理*的 JavaScript 异常并返回一个*空*的 `Napi::Value`。调用代码应该在尝试使用返回值之前检查 `env.IsExceptionPending()`，并且可以使用 `Napi::Env` 类上的方法来检查、获取和清除未处理的 JavaScript 异常。如果未清除未处理的异常，将在原生代码返回 JavaScript 时抛出。

### 禁用 C++ 异常的例子

#### 抛出 JS 异常

```cpp
Napi::Env env = ...
Napi::Error::New(env, "Example exception").ThrowAsJavaScriptException();
return;
```

抛出 JavaScript 异常后，代码通常应在执行任何必要的清理后立即从原生回调返回。

### 传播 Node-API JS 异常

```cpp
Napi::Env env = ...
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Napi::Value result = jsFunctionThatThrows({ arg1, arg2 });
if (env.IsExceptionPending()) {
    Error e = env.GetAndClearPendingException();
    return e.Value();
}
```

如果 `env.IsExceptionPending()` 返回 true，则 JavaScript 异常处于未处理状态。为了让异常传播，代码通常应该在执行任何必要的清理之后立即从原生回调返回。

#### 处理 Node-API JS 异常

```cpp
Napi::Env env = ...
Napi::Function jsFunctionThatThrows = someValue.As<Napi::Function>();
Napi::Value result = jsFunctionThatThrows({ arg1, arg2 });
if (env.IsExceptionPending()) {
    Napi::Error e = env.GetAndClearPendingException();
    cerr << "Caught JavaScript exception: " + e.Message();
}
```

由于这里清除了异常，所以在原生回调返回后不会作为 JavaScript 异常传播。

### 直接从调用 Node-API

**node-addon-api** 提供了在调用 Node-API 函数时抛出错误以响应非 OK `napi_status` 结果的宏。
根据是否启用 C++ 异常，这些宏的定义不同，但在任何一种情况下都可以使用。

#### `NAPI_THROW(e, ...)`

这个宏接受一个 `Napi::Error` 并抛出，返回最后一个参数给出的值。如果启用了 C++ 异常（通过在构建期间定义 `NAPI_CPP_EXCEPTIONS`），则返回值将被忽略。

#### `NAPI_THROW_IF_FAILED(env, status, ...)`

这个宏接受一个 `Napi::Env` 和一个 `napi_status`。它从 `napi_status` 构造一个错误并抛出，返回最后一个参数给出的值。如果启用了 C++ 异常（通过在构建期间定义 `NAPI_CPP_EXCEPTIONS`），则返回值将被忽略。

#### `NAPI_THROW_IF_FAILED_VOID(env, status)`

这个宏接受一个 `Napi::Env` 和一个 `napi_status`。它从 `napi_status` 构造一个错误并抛出，然后返回。

#### `NAPI_FATAL_IF_FAILED(status, location, message)`

此宏接受一个 `napi_status`、一个指示错误发生位置的 C 字符串，以及用于显示消息的第二个 C 字符串。
