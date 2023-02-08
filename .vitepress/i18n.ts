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
    usingRust: 'Using Rust (Experimental)',
    errorHandling: 'Error Handling',
    functionBinding: 'Function Binding',
    classBinding: 'Class Binding',
    multithreadedAsync: 'Multithreaded Asynchronous Operations',
    tsfn: 'Thread Safe Function',
    faq: 'FAQ',

    advanced: 'Advanced',
    emnapiRuntime: 'emnapi Runtime',
    modularization: 'Modularization',

    apiList: 'API List',
    additionalApi: 'Additional APIs',
    docsRepo: 'Docs Repo'
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
    usingRust: '使用 Rust（实验性）',
    errorHandling: '错误处理',
    functionBinding: '函数绑定',
    classBinding: '类绑定',
    multithreadedAsync: '多线程异步',
    tsfn: '线程安全函数',
    faq: '常见问题',

    advanced: '进阶',
    emnapiRuntime: 'emnapi 运行时',
    modularization: '模块化',

    apiList: 'API 列表',
    additionalApi: '额外新增的 API',
    docsRepo: '文档仓库'
  }
} as const

export default tr

export type Lang = keyof typeof tr
