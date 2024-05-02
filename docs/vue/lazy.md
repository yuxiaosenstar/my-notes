---
title: vue实现路由懒加载（异步加载）及组件懒加载（异步加载）的方式
sidebar: 'auto'
---

一、为什么要使用路由懒加载
为给客户更好的客户体验，首屏组件加载速度更快一些，解决白屏问题。

二、定义
懒加载简单来说就是延迟加载或按需加载，即在需要的时候的时候进行加载。

三、使用
常用的懒加载方式有两种：即使用 vue 异步组件 和 ES 中的 import

### 一、路由懒加载

#### 1、未用懒加载，vue 中路由代码如下

```js
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
  ],
})
```

#### 2、vue 异步组件实现懒加载

方法如下：component：resolve=>(require(['需要加载的路由的地址'])，resolve)

```js
import Vue from 'vue'
import Router from 'vue-router' /* 此处省去之前导入的HelloWorld模块 */

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: (resolve) => require(['@/components/HelloWorld'], resolve),
    },
  ],
})
```

#### 3、ES 提出的 import 方法，（------最常用------）

方法如下：const HelloWorld = （）=>import('需要加载的模块地址')
（不加 { } ，表示直接 return)

```js
import Vue from 'vue'
import Router from 'vue-router'
const HelloWorld = () => import('@/components/HelloWorld')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
  ],
})
```

### 二、组件懒加载

相同于路由懒加载

#### 1、原来组件中写法

```html
<template>
  <div class="hello">
    <One-com></One-com>
    1111
  </div>
</template>

<script>
  import One from './one'
  export default {
    components: {
      'One-com': One,
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
      }
    },
  }
</script>
```

#### 2、import 方法

```html
<template>
  <div class="hello">
    <One-com></One-com>
    1111
  </div>
</template>

<script>
  const One = () => import('./one')
  export default {
    components: {
      'One-com': One,
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
      }
    },
  }
</script>
```

#### 3、异步方法

```html
<template>
  <div class="hello">
    <One-com></One-com>
    1111
  </div>
</template>

<script>
  export default {
    components: {
      'One-com': (resolve) => (['./one'], resolve),
    },
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
      }
    },
  }
</script>
```

### 三、总结：

路由和组件的常用两种懒加载方式：

1、vue 异步组件实现路由懒加载
component：resolve=>(['需要加载的路由的地址'，resolve])

2、es 提出的 import(推荐使用这种方式)
const HelloWorld = （）=>import('需要加载的模块地址')
