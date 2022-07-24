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
  description: 'emnapi - The Subset of Node-API implementation for Emscripten',
  lastUpdated: true,
  srcDir: 'src',
  scrollOffset: 'header',

  vite: {
    publicDir
  },

  locales: {
    '/': { lang: 'en-US' },
    '/zh/': {
      lang: ' zh-CN',
      description: 'emnapi - 适用于 Emscripten 的 Node-API 子集实现'
    },
  },

  themeConfig: {
    logo: '/emnapi.svg',
    repo: 'toyobayashi/emnapi-docs',
    repoLabel: 'Docs Repo',
    docsBranch: 'main',
    docsDir: 'src',
    lastUpdated: 'Last Updated',
    prevLinks: true,
    nextLinks: true,
    editLinks: true,
    editLinkText: 'Any mistake found? Correct it now!',
    locales: {
      '/': {
        label: 'English',
        nav: getNav('/'),
        sidebar: getSideBar('/')
      },
      '/zh/' : {
        label: '简体中文',
        selectText: '语言',
        repoLabel: '文档仓库',
        editLinkText: '在 Github 上编辑本页',
        nav: getNav('/zh/'),
        sidebar: getSideBar('/zh/')
      },
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
    { text: 'Github', link: 'https://github.com/toyobayashi/emnapi' },
  ]
}

function getSideBar (lang: Lang): DefaultTheme.MultiSideBarConfig {
  return {
    [`${lang}guide/`]: getGuideSidebar(lang),
    [`${lang}`]: getGuideSidebar(lang),
  }
}

function getGuideSidebar (lang: Lang): DefaultTheme.SideBarItem[] {
  return [
    {
      text: tr[lang].guide,
      children: [
        { text: tr[lang].whatIsEmnapi, link: `${lang}guide/` },
        { text: tr[lang].gettingStarted, link: `${lang}guide/getting-started` },
        { text: tr[lang].usingCppWrapper, link: `${lang}guide/using-cpp` },
        { text: tr[lang].usingCMake, link: `${lang}guide/using-cmake` },
        { text: tr[lang].errorHandling, link: `${lang}guide/error-handling` },
        { text: tr[lang].functionBinding, link: `${lang}guide/function-binding` },
        { text: tr[lang].classBinding, link: `${lang}guide/class-binding` },
      ]
    },
    {
      text: tr[lang].advanced,
      children: [
        { text: tr[lang].multithreadedAsync, link: `${lang}guide/multithreaded-async` },
        { text: tr[lang].emnapiRuntime, link: `${lang}guide/runtime` },
        { text: tr[lang].modularization, link: `${lang}guide/modularization` }
      ]
    },
    {
      text: 'API',
      children: [
        { text: tr[lang].apiList, link: `${lang}reference/list` },
        { text: tr[lang].additionalApi, link: `${lang}reference/additional` }
      ]
    }
  ]
}
