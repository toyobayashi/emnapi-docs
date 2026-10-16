import { join, dirname } from 'node:path'
import { defineConfig, DefaultTheme } from 'vitepress'
import tr, { Lang } from './i18n'

function getFilename () {
  if (process.platform === 'win32') {
    return import.meta.url.replace(/^file:\/+/, '').replace(/\//g, '\\')
  }
  return import.meta.url.substring(7)
}

function getDirname () {
  return dirname(getFilename())
}

const publicDir = join(getDirname(), '../public')
console.log(`publicDir: ${publicDir}`)

export default defineConfig({
  base: process.env.EMNAPI_DOCS_BASE || '/',
  lang: 'en-US',
  title: 'emnapi',
  description: 'emnapi - The Subset of Node-API implementation for WebAssembly',
  lastUpdated: true,
  srcDir: 'src',
  scrollOffset: 'header',

  vite: {
    publicDir
  },

  locales: {
    root: {
      lang: 'en',
      label: 'English',
      description: 'emnapi - The Subset of Node-API implementation for WebAssembly',
      themeConfig: {
        lastUpdatedText: 'Last Updated',
        editLink: {
          pattern: 'https://github.com/toyobayashi/emnapi-docs/edit/main/src/:path',
          text: 'Any mistake found? Correct it now!'
        },
        nav: getNav('/'),
        sidebar: getSideBar('/'),
      }
    },
    zh: {
      lang: 'zh',
      label: '简体中文',
      description: 'emnapi - 适用于 WebAssembly 的 Node-API 子集实现',
      themeConfig: {
        lastUpdatedText: '上次更新于',
        editLink: {
          pattern: 'https://github.com/toyobayashi/emnapi-docs/edit/main/src/:path',
          text: '在 Github 上编辑本页'
        },
        nav: getNav('/zh/'),
        sidebar: getSideBar('/zh/'),
      }
    },
  },

  themeConfig: {
    logo: '/emnapi.svg',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2021-PRESENT toyobayashi',
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/toyobayashi/emnapi'
      }
    ],
    algolia: {
      appId: '0UYMT1XPL1',
      apiKey: '93bb252b942dac8d9c4e6e8432d1ab99',
      indexName: 'emnapi'
    }
  }
})

function getNav (lang: Lang): DefaultTheme.NavItem[] {
  return [
    {
      text: tr[lang].versions,
      items: [
        { text: tr[lang].emnapiV1, link: `${lang}v1/` },
        { text: tr[lang].emnapiV2, link: `${lang}v2/` },
      ]
    },
    {
      text: tr[lang].guide,
      items: [
        { text: tr[lang].emnapiV1 + ' ' + tr[lang].guide, link: lang + 'v1/guide/' },
        { text: tr[lang].emnapiV2 + ' ' + tr[lang].guide, link: lang + 'v2/guide/' },
      ],
      activeMatch: '^' + lang + 'v[12]/guide/'
    },
    { text: tr[lang].examples, link: 'https://github.com/toyobayashi/node-addon-examples' },
    { text: tr[lang].docsRepo, link: 'https://github.com/toyobayashi/emnapi-docs' }
  ]
}

function getSideBar (lang: Lang): DefaultTheme.SidebarMulti {
  return {
    [`${lang}v1/guide/`]: getGuideSidebar(lang, 'v1'),
    [`${lang}v1/`]: getGuideSidebar(lang, 'v1'),
    [`${lang}v2/guide/`]: getGuideSidebar(lang, 'v2'),
    [`${lang}v2/`]: getGuideSidebar(lang, 'v2'),
  }
}

function getGuideSidebar (lang: Lang, version: 'v1' | 'v2'): DefaultTheme.SidebarItem[] {
  const base = `${lang}${version}/`
  const advancedItems: DefaultTheme.SidebarItem[] = [
    // { text: tr[lang].emnapiRuntime, link: `${base}guide/runtime` },
    { text: tr[lang].modularization, link: `${base}guide/modularization` },
    { text: tr[lang].multithreadedAsync, link: `${base}guide/multithreaded-async` },
    { text: tr[lang].tsfn, link: `${base}guide/tsfn` },
    { text: tr[lang].faq, link: `${base}guide/faq` },
  ]
  if (version === 'v2') {
    advancedItems.push(
      { text: tr[lang].migrationFromV1, link: `${base}guide/migration-from-v1` },
      { text: tr[lang].v8Nan, link: `${base}guide/v8-nan` },
    )
  }
  return [
    {
      text: tr[lang].guide,
      items: [
        { text: tr[lang].introduction, link: `${base}guide/` },
        { text: tr[lang].gettingStarted, link: `${base}guide/getting-started` },
        { text: tr[lang].usingCppWrapper, link: `${base}guide/using-cpp` },
        { text: tr[lang].usingCMake, link: `${base}guide/using-cmake` },
        { text: version === 'v2' ? tr[lang].usingNodeGypV2 : tr[lang].usingNodeGyp, link: `${base}guide/using-node-gyp` },
        { text: tr[lang].usingRust, link: `${base}guide/using-rust` },
        { text: tr[lang].errorHandling, link: `${base}guide/error-handling` },
        { text: tr[lang].functionBinding, link: `${base}guide/function-binding` },
        { text: tr[lang].classBinding, link: `${base}guide/class-binding` },
      ]
    },
    {
      text: tr[lang].advanced,
      items: advancedItems
    },
    {
      text: 'API',
      items: [
        { text: tr[lang].apiList, link: `${base}reference/list` },
        { text: tr[lang].additionalApi, link: `${base}reference/additional` }
      ]
    }
  ]
}
