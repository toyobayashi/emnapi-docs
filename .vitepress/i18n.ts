const tr = {
  '/': {
    guide: 'Guide',
    apiReference: 'API Reference',
    examples: 'Examples',

    introduction: 'Introduction',
    whatIsEmnapi: 'What is emnapi',
    gettingStarted: 'Getting Started',
    usingCppWrapper: 'Using C++ Wrapper',
    usingCMake: 'Using CMake',
    errorHandling: 'Error Handling',
    functionBinding: 'Function Binding',
    classBinding: 'Class Binding',

    advanced: 'Advanced',
    emnapiRuntime: 'emnapi Runtime',
    modularization: 'Modularization',

    apiList: 'API List',
    additionalApi: 'Additional APIs'
  },
  '/zh/': {
    guide: '指南',
    apiReference: 'API 参考',
    examples: '代码示例',

    introduction: '介绍',
    whatIsEmnapi: '什么是 emnapi',
    gettingStarted: '开始使用',
    usingCppWrapper: '使用 C++ 包装器',
    usingCMake: '使用 CMake',
    errorHandling: '错误处理',
    functionBinding: '函数绑定',
    classBinding: '类绑定',

    advanced: '进阶',
    emnapiRuntime: 'emnapi 运行时',
    modularization: '模块化',

    apiList: 'API 列表',
    additionalApi: '额外新增的 API'
  }
} as const

export default tr

export type Lang = keyof typeof tr
