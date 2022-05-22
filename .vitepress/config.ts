import { defineConfig, DefaultTheme } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'emnapi',
  description: 'emnapi - The Subset of Node-API implementation for Emscripten',
  srcDir: 'src',
  scrollOffset: 'header',

  // locales: {
  //   '/': { lang: 'en-US' },
  //   '/zh/': { lang: ' zh-CN' },
  // },

  themeConfig: {
    repo: 'toyobayashi/emnapi-docs',
    repoLabel: 'Docs Repo',
    lastUpdated: true,
    prevLinks: true,
    nextLinks: true,
    editLinks: true,
    editLinkText: 'Any mistake found? Correct it now!',
    // locales: {
    //   '/': { label: 'English' },
    //   '/zh/' : { label: '简体中文' },
    // },
    nav: [
      { text: 'Guide', link: '/', activeMatch: '^/$|^/guide/' },
      {
        text: 'API Reference',
        link: '/reference/list',
        activeMatch: '^/reference/'
      },
      { text: 'Github', link: 'https://github.com/toyobayashi/emnapi' },
    ],
    sidebar: {
      '/guide/': getGuideSidebar(),
      '/reference/': getReferenceSidebar(),
      '/': getGuideSidebar(),
    }
  }
})

function getGuideSidebar (): DefaultTheme.SideBarItem[] {
  return [
    {
      text: 'Introduction',
      children: [
        { text: 'What is emnapi', link: '/' },
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Using C++ Wrapper', link: '/guide/using-cpp' },
        { text: 'Using CMake', link: '/guide/using-cmake' }
      ]
    },
    {
      text: 'Advanced',
      children: [
        { text: 'emnapi Runtime', link: '/guide/runtime' }
      ]
    }
  ]
}

function getReferenceSidebar (): DefaultTheme.SideBarItem[] {
  return [
    { text: 'API List', link: '/reference/list' },
    { text: 'Additional APIs', link: '/reference/additional' }
  ]
}
