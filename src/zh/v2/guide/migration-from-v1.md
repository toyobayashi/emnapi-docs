---
sidebarDepth: 3
---

# 从 emnapi v1 迁移

本文介绍 emnapi 2.0.0-beta.2 中 JavaScript API 的重命名。C/C++ addon 中调用的 Node-API 函数仍使用 napi_* 名称。

## 重命名 JavaScript API

| emnapi v1 | emnapi v2 推荐 API |
| --- | --- |
| createNapiModule | createAddonModule |
| NapiModule | AddonModule |
| loadNapiModule | loadAddon |
| loadNapiModuleSync | loadAddonSync |
| instantiateNapiModule | instantiateAddon |
| instantiateNapiModuleSync | instantiateAddonSync |
| InstantiatedSource.napiModule | InstantiatedAddonSource.addonModule |
| Context.prototype.dispose() | Context.prototype.destroy() |

Context 清理方法现名为 destroy()；Node.js 会在 beforeExit 时自动调用，除非先调用 suppressDestroy()。在 2.0.0-beta.2 中，带 napi 名称的 JavaScript 函数和类型仍作为兼容别名保留，但已经标记为弃用，并计划在 2.0.0-rc 中移除。新代码请使用 Addon 命名的 API，并在升级到候选发布版前更新已有导入。

## 更新实例化代码

修改前：

~~~js
import { instantiateNapiModule } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'

const { napiModule } = await instantiateNapiModule(wasmBytes, {
  context: createContext()
})
const binding = napiModule.exports
~~~

修改后：

~~~js
import { instantiateAddon } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'

const { addonModule } = await instantiateAddon(wasmBytes, {
  context: createContext()
})
const binding = addonModule.exports
~~~

如果需要分别创建和加载模块，请使用 createAddonModule 搭配 loadAddon 或 loadAddonSync。对应的 createNapiModule 和 loadNapiModule 名称在此 beta 阶段仍作为兼容别名保留。

## Emscripten 初始化

Module.emnapiInit 仍是 Emscripten 的初始化方法。生成的 Emscripten 模块就绪后调用它，并使用返回值作为 binding 导出：

~~~js
import init from './out/binding.js'
import { createContext } from '@emnapi/runtime'

const Module = await init()
const binding = Module.emnapiInit({ context: createContext() })
binding.run()
~~~

这与 @emnapi/core 中已弃用的 NapiModule / napiModule 名称是两回事。

## 检查 Node-API 版本

v2 头文件支持 Node-API 1 到 10，默认版本为 8。请查看 [v2 API 列表](/zh/v2/reference/list.html)了解按版本提供和实验性 API。迁移期间也可以通过版本菜单继续查看 [v1 文档](/zh/v1/)。
