# 函数绑定

## 参数处理

假设需要编写一个 C 函数来连接两个 JavaScript 字符串：

```ts
export declare function concatString (str1: string, str2: string): string
```

```js
Module.onRuntimeInitialized = function () {
  const result = Module.emnapiExports.concatString('Hello ', '世界')
  console.log(result) // 'Hello 世界'
}
```

### Node-API 实现

```c
#include <node_api.h>
#include <string.h>
#include <stdlib.h>

#define NAPI_CALL(env, the_call) /* ... */

static napi_value js_concat_string(napi_env env, napi_callback_info info) {
  size_t argc = 2;
  napi_value args[2];
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  if (argc < 2) {
    napi_throw_type_error(env, NULL, "Wrong number of arguments");
    return NULL;
  }

  napi_valuetype valuetype0, valuetype1;
  NAPI_CALL(env, napi_typeof(env, args[0], &valuetype0));
  NAPI_CALL(env, napi_typeof(env, args[1], &valuetype1));

  if (valuetype0 != napi_string || valuetype1 != napi_string) {
    napi_throw_type_error(env, NULL, "Wrong arguments");
    return NULL;
  }

  size_t len1 = 0;
  size_t len2 = 0;
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[0], NULL, 0, &len1));
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[1], NULL, 0, &len2));

  size_t total_buffer_size = len1 + len2 + 1;
  char* str = (char*) malloc(total_buffer_size);
  if (str == NULL) {
    napi_throw_error(env, NULL, "malloc failed");
    return NULL;
  }
  napi_status status = napi_get_value_string_utf8(env, args[0],
                                                  str, total_buffer_size, &len1);
  if (status != napi_ok) {
    free(str);
    NAPI_CALL(env, status);
  }
  status = napi_get_value_string_utf8(env, args[1],
                                      str + len1, total_buffer_size - len1, &len2);
  if (status != napi_ok) {
    free(str);
    NAPI_CALL(env, status);
  }
  *(str + len1 + len2) = '\0';

  napi_value ret;
  status = napi_create_string_utf8(env, str, len1 + len2, &ret);
  free(str);
  NAPI_CALL(env, status);
  return ret;
}

NAPI_MODULE_INIT() {
  napi_value concat_string_fn;
  NAPI_CALL(env, napi_create_function(env, "concatString", NAPI_AUTO_LENGTH,
                                      js_concat_string, NULL, &concat_string_fn));
  NAPI_CALL(env, napi_set_named_property(env, exports,
                                         "concatString", concat_string_fn));
  return exports;
}
```

### node-addon-api 实现

::: warning

如果运行时不支持 `FinalizationRegistry` 和 `WeakRef`则**不能**使用 node-addon-api。

:::

```cpp
#include <napi.h>

Napi::Value JsConcatString(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  if (info.Length() < 2) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong number of arguments");
    NAPI_THROW(e, Napi::Value());
  }

  if (!info[0].IsString() || !info[1].IsString()) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong arguments");
    NAPI_THROW(e, Napi::Value());
  }

  std::string str1 = info[0].As<Napi::String>().Utf8Value();
  std::string str2 = info[1].As<Napi::String>().Utf8Value();
  std::string result = str1 + str2;

  return Napi::String::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "concatString"),
              Napi::Function::New(env, JsConcatString, "concatString"));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
```

## 传递回调函数

让我们改一下上面的例子，传递一个 JavaScript 回调函数来接收字符串连接的结果。

```ts
export declare function concatString (
  str1: string,
  str2: string,
  callback: (result: string) => void
): void
```

```js
Module.onRuntimeInitialized = function () {
  Module.emnapiExports.concatString('Hello ', '世界', (result) => {
    console.log(result) // 'Hello 世界'
  })
}
```

### Node-API 实现

```c
static napi_value js_concat_string(napi_env env, napi_callback_info info) {
  size_t argc = 3;
  napi_value args[3];
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));

  if (argc < 3) {
    napi_throw_type_error(env, NULL, "Wrong number of arguments");
    return NULL;
  }

  napi_valuetype valuetype0, valuetype1, valuetype2;
  NAPI_CALL(env, napi_typeof(env, args[0], &valuetype0));
  NAPI_CALL(env, napi_typeof(env, args[1], &valuetype1));
  NAPI_CALL(env, napi_typeof(env, args[2], &valuetype2));

  if (valuetype0 != napi_string ||
      valuetype1 != napi_string ||
      valuetype2 != napi_function) {
    napi_throw_type_error(env, NULL, "Wrong arguments");
    return NULL;
  }

  size_t len1 = 0;
  size_t len2 = 0;
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[0], NULL, 0, &len1));
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[1], NULL, 0, &len2));

  size_t total_buffer_size = len1 + len2 + 1;

  char* str = (char*) malloc(total_buffer_size);
  if (str == NULL) {
    napi_throw_error(env, NULL, "malloc failed");
    return NULL;
  }
  napi_status status = napi_get_value_string_utf8(env, args[0],
                                                  str, total_buffer_size, &len1);
  if (status != napi_ok) {
    free(str);
    NAPI_CALL(env, status);
  }
  status = napi_get_value_string_utf8(env, args[1],
                                      str + len1, total_buffer_size - len1, &len2);
  if (status != napi_ok) {
    free(str);
    NAPI_CALL(env, status);
  }
  *(str + len1 + len2) = '\0';

  napi_value ret;
  status = napi_create_string_utf8(env, str, len1 + len2, &ret);
  free(str);
  NAPI_CALL(env, status);

  napi_value undefined;
  NAPI_CALL(env, napi_get_undefined(env, &undefined));

  napi_value ignored;
  NAPI_CALL(env, napi_call_function(env, undefined, args[2], 1, &ret, &ignored));

  return undefined;
}
```

### node-addon-api 实现

::: warning

如果运行时不支持 `FinalizationRegistry` 和 `WeakRef`则**不能**使用 node-addon-api。

:::

```cpp
Napi::Value JsConcatString(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  if (info.Length() < 3) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong number of arguments");
    NAPI_THROW(e, Napi::Value());
  }

  if (!info[0].IsString() || !info[1].IsString() || !info[2].IsFunction()) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong arguments");
    NAPI_THROW(e, Napi::Value());
  }

  Napi::Value undefined = env.Undefined();

  std::string str1 = info[0].As<Napi::String>().Utf8Value();
  std::string str2 = info[1].As<Napi::String>().Utf8Value();
  std::string result = str1 + str2;

  info[2].As<Napi::Function>().Call(undefined, { Napi::String::New(env, result) })

  return undefined;
}
```
