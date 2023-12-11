---
title: vue-property-decorator用法
sidebar: 'auto'
---

如果想要在 vue2.0 中使用 ts 语法,需要引用 vue-property-decorator 这个第三方 js 库

此组件基本依赖于 vue-class-component 用于以下属性:

- @Component (完全继承于 vue-class-component)
- @Emit
- @Inject
- @Provice
- @Prop
- @Watch
- @Model

一.安装

```bash
npm install --save vue-property-decorator
```

二. ts 页面中基本写法

```js
import { Component, Vue, Inject } from 'vue-property-decorator'
@Component({
  components: {},
})
export default class SubjectList extends Vue {
  dialogVisible: boolean = false
  storageVisible: boolean = false
  config: any = {
    style: 'table-form',
    queryUrl: 'Subject/GetAll',
    isCustom: true,
    params: {},
  }

  created() {}
}
```

可以看到,这里的变量,与钩子都属于同级,会少些一些代码

三.下面讲几个用的较多的几个属性

1.组件引用

```js
import { Component, Vue, Inject } from 'vue-property-decorator'
import addSelectProduct from '../../coupon/components/addSelectProduct/addSelectProduct.component.vue'
@Component({
  components: {
    addSelectProduct,
  },
})
export default class SubjectList extends Vue {
  dialogVisible: boolean = false
  storageVisible: boolean = false
  config: any = {
    style: 'table-form',
    queryUrl: 'Subject/GetAll',
    isCustom: true,
    params: {},
  }

  created() {}
}
```

2. watch 监听属性

```js
import { Component, Vue, Inject, Watch } from 'vue-property-decorator'
@Component({
  components: {},
})
export default class SubjectList extends Vue {
  dialogVisible: boolean = false
  storageVisible: boolean = false
  config: any = {
    style: 'table-form',
    queryUrl: 'Subject/GetAll',
    isCustom: true,
    params: {},
  }
  productList: any = []

  // 监听属性
  @Watch('dialogVisible')
  onCountChanged(val: any, oldVal: any) {
    console.log(val)
  } // 监听属性
  @Watch('productList', { deep: true })
  onCountChanged2(val: any, oldVal: any) {
    console.log(val)
  }

  created() {}
}
```

1. 通过引用 Watch, @watch()中第一个参数为: 监听的属性名, 第二个参数为可选对象(可用来监听对象,数组复杂类型)
2. 当监听多个属性值时, 同法往下累加, 注意:定义监听函数的名字不能相同,如上例:onCountChanged 和 onCountChanged2

3.计算属性

```js
import { Component, Vue, Inject } from 'vue-property-decorator'
@Component({
  components: {},
})
export default class SubjectList extends Vue {
  dialogVisible: boolean = false
  storageVisible: boolean = false
  config: any = {
    style: 'table-form',
    queryUrl: 'Subject/GetAll',
    isCustom: true,
    params: {},
  }
  limitType: number = 0

  // 计算属性
  get shouldEdit() {
    return !router.currentRoute.query.id
  }

  get getButtonName() {
    let type: any = {
      1: '拼团',
      2: '限时折扣',
    }
    return type[this.limitType]
  }

  created() {}
}
```

使用时只需以 get 开头 + 方法 + 有返回值

4. 混入公共方法 mixins

```js
import { Component, Vue, Inject } from "vue-property-decorator";
import PublicMethod from '@/plugins/mixins/provides/service/publicMethod';

@Component({
  components: {},
  mixins:[PublicMethod]
})
export default class SubjectList extends Vue {
  dialogVisible: boolean = false;
  storageVisible: boolean = false;
  config: any = {
    style: "table-form",
    queryUrl: "Subject/GetAll",
    isCustom: true,
    params: {}
  };

  created() {
     (<any>this).WxShare({ infoId : this.config.params.id , infoType : 7 });
  }
}
```
