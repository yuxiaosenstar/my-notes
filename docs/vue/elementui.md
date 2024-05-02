---
title: Vue 项目中按需引入 ElementUI 的正确方法
sidebar: 'auto'
---

### 第 1 步：创建 Vue 项目

这里就不再赘述 Vue 项目的创建过程，直接执行

```bash
npm i @vue/cli -g
vue create myapp
```

### 第 2 步：安装 ElementUI

在项目的根目录下启动 CMD，执行命令：

```bash
npm i element-ui --save
```

### 第 3 步：安装 babel-plugin-component

在项目根目录下执行命令：

```bash
npm install babel-plugin-component -D
```

### 第 4 步：修改配置文件

本教程使用的 vue cli 版本为 4.5，@vue/cli 4.x 版本搭建的项目中会有 `babel.config.js` 配置文件，如果是旧版的 vue-cli 脚手架工具创建的项目需要在 `.babelrc` 文件中修改。

打开项目根目录下的 `babel.config.js` 文件，配置代码如下：

```js
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset', ['@babel/preset-env', { modules: false }]],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
  ],
}
```

### 第 5 步：按需引入组件

在 `main.js` 入口文件中引入组件：

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Button } from 'element-ui' // 按需引入组件

Vue.component(Button.name, Button) // 注册全局组件
// 或
// Vue.use(Button)
// 或指定组件名称
// Vue.component('my-button', Button);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
```

### 第 6 步：使用组件

```html
<template>
  <div id="app">
    <el-button type="primary">按钮</el-button>
    <!-- <my-button>按钮</my-button> -->
  </div>
</template>
```

### 封装 Element 模块

如果按需引入的组件较多，不适合在 main.js 入口文件中写大量的引入代码，可以自定义 Vue 插件来封装 ElementUI 组件的引用。

新建 `/src/components/element/index.js` 文件，index.js 示例代码如下：

```js
import { Button, Input, Radio, Table, Form } from 'element-ui'

const coms = [Button, Input, Radio, Table, Form]

export default {
  install(Vue, options) {
    coms.map((c) => {
      Vue.component(c.name, c)
    })
  },
}
```

在 main.js 中引入自定义 element 插件：

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入 element 插件
import element from './components/element'
Vue.use(element)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
```

在组件中正常使用 ElementUI 组件即可，示例代码：

```html
<template>
  <div id="app">
    <el-button type="primary">按钮</el-button>
    <el-radio></el-radio>
    <el-input></el-input>
  </div>
</template>
```
