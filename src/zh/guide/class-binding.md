# Class Binding

将类暴露给 JavaScript 比纯原生 Node.js 扩展需要稍微更多一点的工作。

不同的是，使用 emnapi 时需要考虑运行时是否支持 `FinalizationRegistry` 和 `WeakRef`。

在纯原生中，清理回调将在 JavaScript 对象被垃圾回收时调用。
但是 emnapi 是由 JavaScript 实现的，调用清理回调函数依赖于 `FinalizationRegistry` 和 `WeakRef`。

所以如果运行时不支持 `FinalizationRegistry` 和 `WeakRef`，
你需要从 C/C++ 端暴露一个名为 `dispose` 或任何你喜欢的方法，
这样你就可以在 JavaScript 中手动 delete 原生实例指针。

如果运行时支持 `FinalizationRegistry` 和 `WeakRef` 则不需要做额外的工作，
与写原生 Node.js 扩展时所做的相同。

例子：

```cpp
class MyClass {
 public:
  MyClass(int x, std::string y);
  virtual ~MyClass();

  void IncrementX() { ++x_; }

  int GetX() const { return x_; }
  void SetX(int x) { x_ = x; }

  static std::string GetStringFromInstance(const MyClass& instance) {
    return instance.y_;
  }

 private:
  int x_;
  std::string y_;
};
```

将 C++ 类绑定到 JavaScript 类：

```ts
export declare class MyClass {
  /** getter 和 setter */
  x: number

  constructor (x: number, y: string)
  incrementX (): void
  static getStringFromInstance(instance: MyClass): string

  /**
   * 如果运行时不支持 FinalizationRegistry 和 WeakRef，
   * 提供 dispose 方法手动删除原生实例指针
   */
  dispose(): void
}
```

用例：

```js
Module.onRuntimeInitialized = function () {
  const MyClass = Module.emnapiExports.MyClass
  const instance = new MyClass(10, "hello")
  instance.incrementX()
  console.log(instance.x) // 11
  instance.x = 20
  console.log(instance.x) // 20
  console.log(MyClass.getStringFromInstance(instance)) // "hello"

  // 如果运行时不支持 FinalizationRegistry 和 WeakRef，
  // 记得手动调用 dispose
  if (typeof FinalizationRegistry !== 'function') {
    instance.dispose()
    // 调用 dispose 后不可再使用 instance
  }
}
```

## Node-API 实现

### 辅助宏

```cpp
#include <string>
#include <utility>
#include <memory>
#include <node_api.h>
#include <emnapi.h>

#define NAPI_CALL_BASE(env, the_call, ...)                      \
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
      return __VA_ARGS__;                                       \
    }                                                           \
  } while (0)

#define NAPI_CALL(env, the_call)                                \
  NAPI_CALL_BASE(env, the_call, NULL)

#define NAPI_CALL_VOID(env, the_call)                           \
  NAPI_CALL_BASE(env, the_call)
```

### 类声明

```cpp
class MyClass {
 public:
  MyClass(int x, std::string y)
    : x_(x), y_(std::move(y)), env_(nullptr), wrapper_(nullptr) {}

  virtual ~MyClass();

  void IncrementX() { ++x_; }

  int GetX() const { return x_; }
  void SetX(int x) { x_ = x; }

  static std::string GetStringFromInstance(const MyClass& instance) {
    return instance.y_;
  }

 private:
  int x_;
  std::string y_;

 // 以下成员用于绑定

 public:
  static void Register(napi_env env, napi_value exports);

 private:
  napi_env env_;
  napi_ref wrapper_;

  static napi_ref constructor_;
  static napi_value Constructor(napi_env env, napi_callback_info info);
  static void Destructor(napi_env env, void* data, void* hint);
  static napi_value JsDispose(napi_env env, napi_callback_info info);
  static napi_value JsIncrementX(napi_env env, napi_callback_info info);
  static napi_value JsGetX(napi_env env, napi_callback_info info);
  static napi_value JsSetX(napi_env env, napi_callback_info info);
  static napi_value JsGetStringFromInstance(napi_env env, napi_callback_info info);
};

napi_ref MyClass::constructor_ = nullptr;
```

### 注册 JavaScript 类

```cpp
void MyClass::Register(napi_env env, napi_value exports) {
  napi_property_attributes instance_method_attributes =
    static_cast<napi_property_attributes>(napi_writable | napi_configurable);
  napi_property_attributes static_method_attributes =
    static_cast<napi_property_attributes>(instance_method_attributes | napi_static);

  napi_property_descriptor properties[4] = {
    {
      "incrementX", nullptr,
      JsIncrementX, nullptr, nullptr, nullptr,
      instance_method_attributes, nullptr
    },
    {
      "x", nullptr,
      nullptr, JsGetX, JsSetX, nullptr,
      napi_configurable, nullptr
    },
    {
      "getStringFromInstance", nullptr,
      JsGetStringFromInstance, nullptr, nullptr, nullptr,
      static_method_attributes, nullptr
    },
    {
      "dispose", nullptr,
      JsDispose, nullptr, nullptr, nullptr,
      instance_method_attributes, nullptr
    }
  };
  size_t property_size = sizeof(properties) / sizeof(properties[0]);
  napi_value ctor;
  NAPI_CALL_VOID(env, napi_define_class(env, "MyClass", NAPI_AUTO_LENGTH,
                                        MyClass::Constructor, nullptr,
                                        property_size, properties, &ctor));
  NAPI_CALL_VOID(env, napi_create_reference(env, ctor, 1, &constructor_));
  NAPI_CALL_VOID(env, napi_set_named_property(env, exports, "MyClass", ctor));
}

NAPI_MODULE_INIT() {
  MyClass::Register(env, exports);
  return exports;
}
```

### JavaScript 类的构造函数

你可以使用 [emnapi_is_support_weakref](/zh/reference/additional.html#emnapi-is-support-weakref) 来确认运行时是否支持 `FinalizationRegistry` 和 `WeakRef`，如果不支持，不要传清理回调函数给 `napi_wrap`。

```cpp
napi_value MyClass::Constructor(napi_env env, napi_callback_info info) {
  size_t argc = 2;
  napi_value args[2];
  napi_value this_arg;
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, &this_arg, nullptr));

  if (argc < 2) {
    napi_throw_type_error(env, NULL, "Wrong number of arguments");
    return NULL;
  }

  napi_valuetype valuetype0, valuetype1;
  NAPI_CALL(env, napi_typeof(env, args[0], &valuetype0));
  NAPI_CALL(env, napi_typeof(env, args[1], &valuetype1));

  if (valuetype0 != napi_number || valuetype1 != napi_string) {
    napi_throw_type_error(env, NULL, "Wrong arguments");
    return NULL;
  }

  int x;
  size_t len = 0;
  std::string y;
  NAPI_CALL(env, napi_get_value_int32(env, args[0], &x));
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[1], nullptr, 0, &len));
  y.resize(len);
  NAPI_CALL(env, napi_get_value_string_utf8(env, args[1], &y[0], len + 1, &len));

  std::unique_ptr<MyClass> instance = std::make_unique<MyClass>(x, y);
  instance->env_ = env;

  if (emnapi_is_support_weakref()) {
    NAPI_CALL(env, napi_wrap(env,
                            this_arg,
                            instance.get(),
                            MyClass::Destructor,
                            nullptr, /* finalize_hint */
                            &instance->wrapper_));
  } else {
    NAPI_CALL(env, napi_wrap(env,
                            this_arg,
                            instance.get(),
                            nullptr,
                            nullptr, /* finalize_hint */
                            nullptr));
  }

  instance.release();
  return this_arg;
}
```

### 清理和销毁

```cpp
MyClass::~MyClass() {
  if (wrapper_) {
    napi_delete_reference(env_, wrapper_);
    wrapper_ = nullptr;
  }
}

void MyClass::Destructor(napi_env env, void* data, void* hint) {
  MyClass* instance = static_cast<MyClass*>(data);
  delete instance;
}

napi_value MyClass::JsDispose(napi_env env, napi_callback_info info) {
  napi_value this_arg;
  NAPI_CALL(env, napi_get_cb_info(env, info, nullptr, nullptr, &this_arg, nullptr));

  MyClass* instance = nullptr;
  NAPI_CALL(env, napi_remove_wrap(env, this_arg, reinterpret_cast<void**>(&instance)));

  delete instance;

  napi_value undefined;
  NAPI_CALL(env, napi_get_undefined(env, &undefined));
  return undefined;
}
```

### 成员访问器

```cpp
napi_value MyClass::JsGetX(napi_env env, napi_callback_info info) {
  napi_value this_arg;
  NAPI_CALL(env, napi_get_cb_info(env, info, nullptr, nullptr, &this_arg, nullptr));

  MyClass* instance = nullptr;
  NAPI_CALL(env, napi_unwrap(env, this_arg, reinterpret_cast<void**>(&instance)));

  napi_value ret;
  NAPI_CALL(env, napi_create_int32(env, instance->GetX(), &ret));
  return ret;
}

napi_value MyClass::JsSetX(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value args[1];
  napi_value this_arg;
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, &this_arg, nullptr));

  napi_valuetype valuetype0;
  NAPI_CALL(env, napi_typeof(env, args[0], &valuetype0));

  if (valuetype0 != napi_number) {
    napi_throw_type_error(env, NULL, "Wrong arguments");
    return NULL;
  }

  int x = 0;
  NAPI_CALL(env, napi_get_value_int32(env, args[0], &x));

  MyClass* instance = nullptr;
  NAPI_CALL(env, napi_unwrap(env, this_arg, reinterpret_cast<void**>(&instance)));

  instance->SetX(x);

  napi_value undefined;
  NAPI_CALL(env, napi_get_undefined(env, &undefined));
  return undefined;
}
```

### 实例方法

```cpp
napi_value MyClass::JsIncrementX(napi_env env, napi_callback_info info) {
  napi_value this_arg;
  NAPI_CALL(env, napi_get_cb_info(env, info, nullptr, nullptr, &this_arg, nullptr));

  MyClass* instance = nullptr;
  NAPI_CALL(env, napi_unwrap(env, this_arg, reinterpret_cast<void**>(&instance)));

  instance->IncrementX();

  napi_value undefined;
  NAPI_CALL(env, napi_get_undefined(env, &undefined));
  return undefined;
}
```

### 静态方法

```cpp
napi_value MyClass::JsGetStringFromInstance(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value args[1];
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));

  if (argc < 1) {
    napi_throw_type_error(env, NULL, "Wrong number of arguments");
    return NULL;
  }

  napi_valuetype valuetype0;
  NAPI_CALL(env, napi_typeof(env, args[0], &valuetype0));

  if (valuetype0 != napi_object) {
    napi_throw_type_error(env, NULL, "Wrong arguments");
    return NULL;
  }

  MyClass* instance = nullptr;
  NAPI_CALL(env, napi_unwrap(env, args[0], reinterpret_cast<void**>(&instance)));

  std::string result = GetStringFromInstance(*instance);

  napi_value ret;
  NAPI_CALL(env, napi_create_string_utf8(env, result.c_str(), result.length(), &ret));
  return ret;
}
```

## node-addon-api 实现

::: warning

如果运行时不支持 `FinalizationRegistry` 和 `WeakRef`则**不能**使用 node-addon-api。

:::

### 类声明

```cpp
#include <utility>
#include <napi.h>

class MyClass {
 public:
  MyClass(int x, std::string y): x_(x), y_(std::move(y)) {}
  void IncrementX() { ++x_; }

  int GetX() const { return x_; }
  void SetX(int x) { x_ = x; }

  static std::string GetStringFromInstance(const MyClass& instance) {
    return instance.y_;
  }

 protected:
  int x_;
  std::string y_;
};

class JsMyClass : public MyClass, public Napi::ObjectWrap<JsMyClass> {
 public:
  JsMyClass(const Napi::CallbackInfo& info);
  static void Register(Napi::Env env, Napi::Object exports);

 private:
  static Napi::FunctionReference constructor_;
  Napi::Value JsIncrementX(const Napi::CallbackInfo& info);
  Napi::Value JsGetX(const Napi::CallbackInfo& info);
  void JsSetX(const Napi::CallbackInfo& info, const Napi::Value& value);
  static Napi::Value JsGetStringFromInstance(const Napi::CallbackInfo& info);
};

Napi::FunctionReference JsMyClass::constructor_;
```

### 注册 JavaScript 类

```cpp
void JsMyClass::Register(Napi::Env env, Napi::Object exports) {
  napi_property_attributes method_attributes =
    static_cast<napi_property_attributes>(napi_writable | napi_configurable);

  Napi::Function ctor = DefineClass(env, "MyClass", {
    InstanceMethod<&JsMyClass::JsIncrementX>("incrementX", method_attributes),
    InstanceAccessor<&JsMyClass::JsGetX, &JsMyClass::JsSetX>("x", napi_configurable),
    StaticMethod<JsMyClass::JsGetStringFromInstance>("getStringFromInstance", method_attributes),
  });

  constructor_ = Napi::Persistent(ctor);
  exports.Set("MyClass", ctor);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  JsMyClass::Register(env, exports);
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
```

### JavaScript 类的构造函数

```cpp
JsMyClass::JsMyClass(const Napi::CallbackInfo& info):
    Napi::ObjectWrap<JsMyClass>(info), MyClass(0, "") {
  Napi::Env env = info.Env();
  if (info.Length() < 2) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong number of arguments");
    NAPI_THROW(e, Napi::Value());
  }

  if (!info[0].IsNumber() || !info[1].IsString()) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong arguments");
    NAPI_THROW(e, Napi::Value());
  }

  x_ = info[0].As<Napi::Number>().Int32Value();
  y_ = info[1].As<Napi::String>().Utf8Value();
}
```

### 成员访问器

```cpp
Napi::Value JsMyClass::JsGetX(const Napi::CallbackInfo& info) {
  return Napi::Number::New(info.Env(), static_cast<double>(GetX()));
}

void JsMyClass::JsSetX(const Napi::CallbackInfo& info, const Napi::Value& value) {
  if (!info[0].IsNumber()) {
    Napi::TypeError e = Napi::TypeError::New(info.Env(), "Wrong arguments");
    NAPI_THROW(e, Napi::Value());
  }
  SetX(value.As<Napi::Number>().Int32Value());
}
```

### 实例方法

```cpp
Napi::Value JsMyClass::JsIncrementX(const Napi::CallbackInfo& info) {
  IncrementX();
  Napi::Env env = info.Env();
  return info.Env().Undefined();
}
```

### 静态方法

```cpp
Napi::Value JsMyClass::JsGetStringFromInstance(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 1) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong number of arguments");
    NAPI_THROW(e, Napi::Value());
  }
  if (!info[0].IsObject()) {
    Napi::TypeError e = Napi::TypeError::New(env, "Wrong arguments");
    NAPI_THROW(e, Napi::Value());
  }
  JsMyClass* instance = Unwrap(info[0].As<Napi::Object>());
  return Napi::String::New(env, GetStringFromInstance(*instance));
}
```
