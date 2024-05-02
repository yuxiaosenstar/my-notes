---
title: ESLint 的 parser 是个什么东西
sidebar: 'auto'
---

ESLint 会对我们的代码进行校验，而 parser 的作用是将我们写的代码转换为 ESTree，ESLint 会对 ESTree 进行校验。

> ESTree 只是一个 AST 的某一种规范，ESTree 本质上还是 AST

## ESTree

ESLint 默认的 parser ，只转换 js，默认支持 ES5 的语法，可以通过制定 parserOptions 给 ESTree 传递如下选项。

```js
"parserOptions": {
   "ecmaVersion": 6,
   "sourceType": "module",
   "ecmaFeatures": {
      "jsx": true
    }
}
```

- ecmaVersion 可以开启更高 ES 版本的校验（已加入 ES 标准的语法，不包括实验性的语法），但需要注意的是一些新标准中的语法对 ESLint 的版本也有要求，如果发现 ESLint 不支持校验，可能需要升级 ESLint 版本
- sourceType 可以设置为 "script"，如果使用 ESModule 可以设置为 "module"

## [@babel/eslint-parser](https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser)

> [babel-eslint](https://github.com/babel/babel-eslint) 不再维护和更新

该 parser 允许你使用 ESLint 校验所有 babel code。

ESLint 的默认解析器和核心规则仅支持最新的最终 ECMAScript 标准，不支持 Babel 提供的实验性（例如新功能）和非标准（例如 Flow 或 TypeScript 类型）语法。@ babel / eslint-parser 是允许 ESLint 在由 Babel 转换的源代码上运行的解析器。

> 如果你使用该解析器，还要使用 babel

当你使用 babel 时，babel 的解析器会把你的 code 转换为 AST，该解析器会将其转换为 ESLint 能懂的 ESTree。

> ESLint 的核心规则不支持实验性语法，因此可能无法正常工作，需要使用 [@babel/eslint-plugin](https://github.com/babel/babel/tree/main/eslint/babel-eslint-plugin) 规则集。并且 ESLint 官方文档中的 parserOptions 只适用 Espree 解析器

该 praser 的 parserOptions 默认配置如下：

```
module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: true, // 是否需要 babel 配置文件
    sourceType: "module", // script 或者 module
    allowImportExportEverywhere: false, // 设置为 true，import 和 export 声明 可以出现在文件的任务位置，否则只能出现在顶部
    ecmaFeatures: {
      globalReturn: false, // 设置为 true，当 sourceType 为 script 时，允许全局 return
    },
    babelOptions: {
      configFile: "path/to/config.js", // babel 的配置文件，可以不传
    },
  },
};
```

## [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)

ESLint 与 Typescript 对比：

- ESLint：一个很棒的 javascript Linter，它的默认 parser 会将代码转换为 AST，AST 被 plugin&rules 用来校验和生成错误信息
- Typescript: 一个很棒的 JavaScript 代码静态代码分析器。它的 parser 会将源码转换为 AST，这个 AST 被 typescript 编译器其他部分用来做校验例如类型检查等

然而，ESLint 识别的 AST 也就是它默认的 parser 最终转换出来的 AST 数据内容和格式（ESTree），与 typescript 的 parser 转换出来的 AST 的内容和格式是不一样的，所以 ESLint 是不能识别 typescript 的 parser 转换出来的 AST 内容。

这是 @typescript-eslint 存在的原因，兼容两者的 AST。

> TSLint 不再推荐使用，并且后期这个仓库也会被抛弃，原因是 TSLint 是基于 Typescript 的 parser 转换出来的 AST，不能与 ESLint 一起使用

@typescript-eslint 主要包含几个包：

- [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser)
  - 读取 ESLint 的配置，并调用下面的这包
- [@typescript-eslint/typescript-estree](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/typescript-estree)
  - 调用 TypeScript Compiler，将 typescript 的 sourcecode 转换为 TypeScript AST，然后将 TypeScript AST 转换为 ESTree。

> 所以这块前提是需要安装 typescript 的

- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin)
  - 有很多 ESLint 的规则我们是可以复用的。尽管我们对 TypeScript AST 进行了转换，但转换后的 ESTree 中，针对 typescript 中的语法，ESLint 仍然是看不懂的。所以对于 typescript，ESLint 提供的一些规则不再适用。
  - 因此该 plugin 的存在就是为了做这样一件事，提供相应的 rule，让 ESLint 能够识别。同时为了避免冲突，在手动开启该 plugin 的某些规则时，需要将 ESLint 当中的一些规则关闭。

babel 支持解析 Typescript sourcecode，对于一些 Typescript 目前还不支持的语法，babel 可以解析，就像 js 需要使用 babel 一样。所以 Typescript Complier 不支持语法的 babel 支持。

所以如果在 Typesciprt 中使用了 babel，而 ESLint 的 parser 又是使用的 @typescript-eslint/parser 和其提供的 rules，由于 @typescript-eslint/parser 底层是依赖 Typescript complier 作为编译器，而 babel 转换时使用的是其自己的编译器，两者不一致，可能会出现使用了 babel 中支持而 Typescript complier 不支持的 Typescript 语法，然后 ESLint 报错的情况。出现这种情况，有两种解决方式。

1. 将 ESLint 的 parser 和 rules 替换为前面提到的 @babel/eslint-parser 和对应的 rules，这样就不会出现 babel 和 ESLint 的 parser 不一致

2. 继续使用 @typescript-eslint/parser 和其提供的 rules，因为它支持我们自定义 rules，可以去社区找找对应的语法是否已经存在相关的 rule，或者自己编写。

## vue 如何配置 ESLint

vue 官方提供了一个 ESLint 插件 [eslint-plugin-vue](https://eslint.vuejs.org/user-guide/#installation)，它提供了 parser 和 rules。parser 为 [vue-eslint-parser](https://github.com/vuejs/vue-eslint-parser#readme)，rules 为 [https://eslint.vuejs.org/rules/](https://eslint.vuejs.org/rules/)。

如果想为 vue 单文件组件中的 script 部分使用单独的 parser 可以将 parserOptions.parser 指定为想使用的 parser 即可
