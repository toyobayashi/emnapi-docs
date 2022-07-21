import { defineConfig, DefaultTheme } from 'vitepress'
import tr, { Lang } from './i18n'

export default defineConfig({
  base: process.env.EMNAPI_DOCS_BASE || '/',
  lang: 'en-US',
  title: 'emnapi',
  description: 'emnapi - The Subset of Node-API implementation for Emscripten',
  lastUpdated: true,
  srcDir: 'src',
  scrollOffset: 'header',

  locales: {
    '/': {
      lang: 'en-US',
      label: 'English',
      description: 'emnapi - The Subset of Node-API implementation for Emscripten',
      selectText: 'English'
    },
    '/zh/': {
      lang: ' zh-CN',
      label: '简体中文',
      description: 'emnapi - 适用于 Emscripten 的 Node-API 子集实现',
      selectText: '简体中文'
    },
  },

  themeConfig: {
    lastUpdatedText: 'Last Updated',
    editLink: {
      pattern: 'https://github.com/toyobayashi/emnapi-docs/edit/main/src/:path',
      text: 'Any mistake found? Correct it now!'
    },
    nav: getNav('/'),
    sidebar: {
      ...getSideBar('/zh/'),
      ...getSideBar('/'),
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/toyobayashi/emnapi'
      }
    ],
    localeLinks: {
      text: '',
      items: [
        { text: 'English', link: '/guide/' },
        { text: '简体中文', link: '/zh/guide/' },
      ],
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-PRESENT toyobayashi',
    },
    algolia: {
      appId: '0UYMT1XPL1',
      apiKey: '93bb252b942dac8d9c4e6e8432d1ab99',
      indexName: 'emnapi'
    }
  }
})

function getNav (lang: Lang): DefaultTheme.NavItem[] {
  return [
    { text: tr[lang].guide, link: `${lang}/guide/`, activeMatch: `^/(\\S+/)?guide/` },
    { text: tr[lang].examples, link: 'https://github.com/toyobayashi/node-addon-examples' },
    { text: tr[lang].docsRepo, link: 'https://github.com/toyobayashi/emnapi-docs' }
  ]
}

function getSideBar (lang: Lang): DefaultTheme.SidebarMulti {
  return {
    [`${lang}guide/`]: getGuideSidebar(lang),
    [`${lang}`]: getGuideSidebar(lang),
  }
}

function getGuideSidebar (lang: Lang): DefaultTheme.SidebarGroup[] {
  return [
    {
      text: tr[lang].guide,
      items: [
        { text: tr[lang].whatIsEmnapi, link: `${lang}guide/` },
        { text: tr[lang].gettingStarted, link: `${lang}guide/getting-started` },
        { text: tr[lang].usingCppWrapper, link: `${lang}guide/using-cpp` },
        { text: tr[lang].usingCMake, link: `${lang}guide/using-cmake` },
        { text: tr[lang].errorHandling, link: `${lang}guide/error-handling` }
      ]
    },
    {
      text: tr[lang].advanced,
      items: [
        { text: tr[lang].emnapiRuntime, link: `${lang}guide/runtime` },
        { text: tr[lang].modularization, link: `${lang}guide/modularization` }
      ]
    },
    {
      text: 'API',
      items: [
        { text: tr[lang].apiList, link: `${lang}reference/list` },
        { text: tr[lang].additionalApi, link: `${lang}reference/additional` }
      ]
    }
  ]
}
