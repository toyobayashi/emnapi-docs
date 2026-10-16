---
sidebarDepth: 3
---

# Migrating from emnapi v1

This guide covers the JavaScript API renames in emnapi 2.0.0-beta.2. The Node-API calls in your C or C++ addon remain named napi_*.

## Rename the JavaScript APIs

| emnapi v1 | Preferred emnapi v2 API |
| --- | --- |
| createNapiModule | createAddonModule |
| NapiModule | AddonModule |
| loadNapiModule | loadAddon |
| loadNapiModuleSync | loadAddonSync |
| instantiateNapiModule | instantiateAddon |
| instantiateNapiModuleSync | instantiateAddonSync |
| InstantiatedSource.napiModule | InstantiatedAddonSource.addonModule |
| Context.prototype.dispose() | Context.prototype.destroy() |

Context cleanup is now named destroy(); in Node.js, it runs automatically on beforeExit unless suppressDestroy() was called. The napi-named JavaScript functions and types are still available in 2.0.0-beta.2 for compatibility, but are marked deprecated and scheduled for removal in 2.0.0-rc. Prefer the Addon-named APIs for new code and update existing imports before upgrading to the release candidate.

## Update instantiation code

Before:

~~~js
import { instantiateNapiModule } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'

const { napiModule } = await instantiateNapiModule(wasmBytes, {
  context: createContext()
})
const binding = napiModule.exports
~~~

After:

~~~js
import { instantiateAddon } from '@emnapi/core'
import { createContext } from '@emnapi/runtime'

const { addonModule } = await instantiateAddon(wasmBytes, {
  context: createContext()
})
const binding = addonModule.exports
~~~

If you create and load a module separately, use createAddonModule with loadAddon or loadAddonSync. The corresponding createNapiModule and loadNapiModule names remain compatibility aliases during this beta.

## Emscripten initialization

Module.emnapiInit remains the Emscripten initialization method. Call it after the generated Emscripten module is ready and use its return value as the binding exports:

~~~js
import init from './out/binding.js'
import { createContext } from '@emnapi/runtime'

const Module = await init()
const binding = Module.emnapiInit({ context: createContext() })
binding.run()
~~~

This is separate from the deprecated NapiModule / napiModule names in @emnapi/core.

## Check the Node-API version

The v2 headers support Node-API versions 1 through 10 and default to version 8. Review the [v2 API list](/v2/reference/list.html) for version-gated and experimental APIs. The [v1 documentation](/v1/) remains available from the version menu while migrating.
