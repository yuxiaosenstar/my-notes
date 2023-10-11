---
title: Mockjs 使用
sidebar: 'auto'
---

## mockjs

案例：运用 element-ui 实现含分页数据的请求；增加；删除等

![](media/16919258872392/16919259123248.jpg)

mockjs 文件夹的 index.js

```js
import Mock from 'mockjs'

const data = Mock.mock({
  'list|20-60': [
    {
      id: '@increment(1)',
      title: '@ctitle',
      content: '@cparagraph',
      add_time: '@date(yyyy-MM-dd hh:mm:ss)',
    },
  ],
})

// 删除
Mock.mock('/api/delete/news', 'post', (options) => {
  let body = JSON.parse(options.body)
  const index = data.list.findIndex((item) => item.id === body.id)
  data.list.splice(index, 1)
  return {
    status: 200,
    message: '删除成功',
    list: data.list,
  }
})

// 添加
Mock.mock('/api/add/news', 'post', (options) => {
  let body = JSON.parse(options.body)

  data.list.push(
    Mock.mock({
      id: '@increment(1)',
      title: body.title,
      content: body.content,
      add_time: '@date(yyyy-MM-dd hh:mm:ss)',
    })
  )

  return {
    status: 200,
    message: '添加成功',
    list: data.list,
  }
})

// 含有分页的数据列表,有需要接受的参数要使用正则匹配
// /api/get/news?pagenum=1&pagesize=10
Mock.mock(/\/api\/get\/news/, 'get', (options) => {
  console.log(options)
  // 获取传递的参数pageindex
  const pagenum = getQuery(options.url, 'pagenum')
  // 获取传递的参数pagesize
  const pagesize = getQuery(options.url, 'pagesize')
  // 截取数据的起始位置
  const start = (pagenum - 1) * pagesize
  // 截取数据的终点位置
  const end = pagenum * pagesize
  // 计算总页数
  const totalPage = Math.ceil(data.list.length / pagesize)
  // 数据的起始位置：(pageindex-1)*pagesize  数据的结束位置：pageindex*pagesize
  const list = pagenum > totalPage ? [] : data.list.slice(start, end)

  return {
    status: 200,
    message: '获取新闻列表成功',
    list: list,
    total: data.list.length,
  }
})

const getQuery = (url, name) => {
  const index = url.indexOf('?')
  if (index !== -1) {
    const queryStrArr = url.substr(index + 1).split('&')
    for (var i = 0; i < queryStrArr.length; i++) {
      const itemArr = queryStrArr[i].split('=')
      console.log(itemArr)
      if (itemArr[0] === name) {
        return itemArr[1]
      }
    }
  }
  return null
}
```

示例 2：

```js
import Mock from 'mockjs'

// 获取 mock.Random 对象

const Random = Mock.Random

// 正式接口还没有出来之前  给一些假的接口   模拟ajax请求
Mock.mock('/mock/demo', 'get', function () {
  return {
    type: 1,
    code: 200,
    msg: '前端获取mockjs 成功',
    result: {
      username: 'wh2010',
    },
  }
})

Mock.mock('/mock/login', 'post', function (req, res) {
  console.log(req)
  console.log(res)
  return {
    type: 1,
    code: 200,
    msg: '登录成功',
    result: {
      username: 'wh2010',
      password: 'abc123',
    },
  }
})

Mock.mock('/mock/longdata', 'get', function (req, res) {
  const result = []
  for (var i = 0; i < 250; i++) {
    let obj = {
      uid: Random.id(),
      title: Random.csentence(5, 28), // 随机的标题
      city: Random.city(), // 随机的城市
      names: Random.cname(), // 名字
      pic: Random.image('200x100', '#02adea', 'wuhan2010'),
      time: Random.date('yyyy-MM-dd') + ' ' + Random.time(),
    }
    result.push(obj)
  }
  return {
    type: 1,
    code: 200,
    msg: '获取数据成功',
    result,
  }
})
```

App.vue

```html
<template>
  <div id="app">
    <!-- 头部 -->
    <h3 style="text-align: center">数据展示</h3>

    <!-- 添加 -->
    <el-row :gutter="20">
      <el-col :span="8"><el-input v-model="title" placeholder="请输入标题"></el-input></el-col>
      <el-col :span="8"><el-input v-model="content" placeholder="请输入内容"></el-input></el-col>
      <el-col :span="8"><el-button type="primary" @click="handelAdd">添加</el-button></el-col>
    </el-row>

    <!-- 表格 -->
    <template>
      <el-table :data="tableData" style="width: 100%">
        <!-- <el-table-column label="图片" width="120">
          <template v-if="tableData[0]"
            ><img :src="tableData[0].img_url" width="100" height="100"
          /></template>
        </el-table-column> -->
        <el-table-column prop="title" label="标题" width="160"> </el-table-column>
        <el-table-column prop="content" label="内容"> </el-table-column>
        <el-table-column prop="add_time" label="时间" width="160"> </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-button type="primary" @click="prev">上一页</el-button>
    <el-button type="primary" @click="next">下一页</el-button>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        tableData: [],
        title: '',
        content: '',
        pagenum: 1,
        pagesize: 10,
        total: 0,
      }
    },
    methods: {
      // 获取数据列表
      async getList() {
        // axios.get("/api/get/news").then(res => (this.tableData = res.data.list));
        const result = await axios.get('/api/get/news', {
          params: { pagenum: this.pagenum, pagesize: this.pagesize },
        })
        this.tableData = result.data.list
        this.total = result.data.total
      },

      // 删除
      async handleDelete(id) {
        const result = await axios.post('/api/delete/news', { id })
        this.getList()
      },

      // 添加数据
      async handelAdd() {
        if (!this.title || !this.content) {
          alert('请输入内容')
          return
        }

        const result = await axios.post('/api/add/news', {
          title: this.title,
          content: this.content,
        })
        this.getList()
        this.title = ''
        this.content = ''
      },

      prev() {
        if (this.pagenum > 1) {
          this.pagenum--
          this.getList()
        }
      },

      next() {
        if (this.pagenum * this.pagesize < this.total) {
          this.pagenum++
          this.getList()
        } else {
          alert('没有更多的数据')
        }
      },
    },
    created() {
      this.getList()
    },
  }
</script>
```

main.js

```js
import './mockjs/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
```

## 概念

### 什么是 mockJs

生成随机数据，拦截 Ajax 请求

参考文档：https://link.juejin.cn/?target=http%3A%2F%2Fmockjs.com%2Fexamples.html

### 为什么使用 mockJs

如果后端接口还未开发完成，我们自己手动模拟后端接口返回随机数据完成交互功能

1. 采用 json 数据模拟，生成数据比较繁琐，也比较有局限性，没办法达到增删改查
2. 采用 mockJs 进行模拟数据，可以模拟各种场景（get、post）生成接口，并且随机生成所需数据，还可以对数据进行增删改查

### 使用 mockJs

通过 vue-cli 创建基本项目

- 在项目中安装 mock

```bash
npm install mockjs
```

- 在项目中新建 mock 文件夹，在 mock 文件夹中创建 index.js

```js
//引入mock模块
import Mock from 'mockjs'
```

- 将 mock 文件夹的 index.js 文件在 main.js 中导入

```js
import Vue from 'vue'
import App from './App.vue'
import './mock/index.js'

new Vue({
  render: (h) => h(App),
}).$mount('#app')
```

## mock 语法

### 生成字符串

- 生成指定次数字符串

```js
const data = Mock.mock({
  'string|4': 'yx！',
})
console.log(data)
```

- 生成指定范围长度字符串

```js
const data = Mock.mock({
  'string|1-8': 'yx',
})
console.log(data)
```

### 生成文本

- 生成一个随机字符串

```js
const data = Mock.mock({
  string: '@cword',
})
console.log(data)
```

- 生成指定长度和范围

```js
const data = Mock.mock({
  string: '@cword(1)',
  str: '@cword(10,15)',
})
console.log(data)
```

### 生成标题和句子

- 生成标题和句子

```js
const data = Mock.mock({
  title: '@ctitle',
  sentence: '@csentence',
})
console.log(data)
```

- 生成指定长度的标题和句子

```js
const data = Mock.mock({
  title: '@ctitle(8)',
  sentence: '@csentence(50)',
})
```

- 生成指定范围的

```js
const data = Mock.mock({
  title: '@ctitle(5,8)',
  sentence: '@csentence(50,100)',
})
console.log(data)
```

### 生成段落

- 随机生成段落

```js
const data = Mock.mock({
  content: '@cparagraph()',
})
console.log(data)
```

### 生成数字

- 生成指定数字

```js
const data = Mock.mock({
  'number|80': 1,
})
console.log(data)
```

- 生成范围数字

```js
const data = Mock.mock({
  'number|1-999': 1,
})
console.log(data)
```

### 生成增量 id

- 随机生成标识

```js
const data = Mock.mock({
  id: '@increment()',
})
console.log(data)
```

### 生成姓名-地址-身份证号

- 随机生成姓名-地址-身份证号

```js
const data = Mock.mock({
  name: '@cname()',
  idCard: '@id()',
  address: '@city(true)', // 如果@city(),只会生成市，如果@city(true)会生成省和市
})
console.log(data)
```

### 随机生成图片

- 生成图片：

- 参数 1：图片可选大小

- 参数 2：图片背景色

- 参数 3：图片前景色

- 参数 4：图片格式

- 参数 5：图片文字

```js
const data = Mock.mock({
  image: "@image('300x300', '#50B347', '#FFF', 'Mock.js')",
})
console.log(data)
```

### 生成时间

- @Date

- 生成指定格式时间：@date(yyyy-MM-dd hh:mm:ss)

```js
const time = Mock.mock({
  time1: '@date()', // 只有年月日
  time2: '@date(yyyy-MM-dd hh:mm:ss)',
})
console.log(time)
```

### 指定数组返回的条数

- 指定长度：'data|5'

- 指定范围：'data|5-10'

```js
const data = Mock.mock({
  'list|50-99': [
    {
      name: '@cname()',
      address: '@city(true)',
      id: '@increment(1)', // 每次都增加1
    },
  ],
})
```

### mock 拦截请求

- 在项目中安装 axios

```js
npm install axios
```

- 在 main.js 文件引入

```js
import axios from 'axios'
```

- 在 mock 文件夹的 index.js 文件中写 mock 语法

### 定义不携带参数的 get 请求

```js
Mock.mock('/api/get/user', 'get', () => {
  return {
    status: 200,
    message: '获取新闻列表数据成功',
  }
})
```

### 定义 post 请求

```js
Mock.mock('/api/post/user', 'post', () => {
  return {
    status: 200,
    message: '添加新闻列表数据成功',
  }
})
```

- 在 App.vue 文件发送请求

```html
<template>
  <div id="app"></div>
</template>

<script>
  export default {
    created() {
          axios.get('/api/get/user')
            .then(function (response) {
            console.log(response);
         }),

          axios.post('/api/post/user')
            .then(res => console.log(res)),
      }
  }
</script>

<style lang="less" scoped></style>
```

### Mock.mock()

- Mock.mock( requestUrl?, requestType?, template|function(options) )
- Mock.mock( template )
- Mock.mock( requestUrl, template )
- Mock.mock( requestUrl, requestType, template )
- Mock.mock( requestUrl, requestType, function(options) )

> requestUrl: 要拦截的 URL，字符串或正则表达式
> equestType: 要拦截的请求类型，get/post/put/delete/options...
> template: 数据模板
> function(options)：生成响应数据的函数，options --> { url, type, body }

## 语法规范

### 数据模板定义

> 数据模板中每个属性由 3 部分组成： 属性名|生成规则：属性值

1. 'name|min-max': value
2. 'name|count': value
3. 'name|min-max.dmin-dmax': value
4. 'name|min-max.dcount': value
5. 'name|count.dmin-dmax': value
6. 'name|count.dcout': value
7. 'name|+step': value

属性值中可以包含@占位符 属性值还指定了最终值的初始值和类型

### 1.属性值是字符串

1. 'name|min-max': string

> 通过重复 string 生成一个字符串，重复次数大于等于 min，小于等于 max

1. 'name|count': string

> 通过重复 string 生成一个字符串，重复次数等于 count

### 2.属性值是数字

1. 'name|+1': number

> 属性值自动加 1，初始值为 number

1. 'name|min-max': number

> 生成一个大于等于 min、小于等于 max 的整数，属性值 number 只是用来确定类型

1. 'name|min-max.dmin-dmax': number

> 生成一个浮点数，整数部分大于等于 min、小于等于 max，小数部分保留 dmin 到 dmax 位

### 3.属性值是布尔值

1. 'name|1': boolean

> 随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率同样是 1/2

1. 'name|min-max': value

> 随机生成一个布尔值，值为 value 的概率是 min / (min + max)，值为 !value 的概率是 max / (min + max)

### 4.属性值是对象

1. 'name|count': object

> 从属性值 object 中随机选取 count 个属性

1. 'name|min-max': object

> 从属性值 object 中随机选取 min 到 max 个属性

### 5.属性值是数组

1. 'name|1': array

> 从属性值 array 中随机选取 1 个元素，作为最终值

1. 'name|+1': array

> 从属性值 array 中顺序选取 1 个元素，作为最终值

1. 'name|min-max': array

> 通过重复属性值 array 生成一个新数组，重复次数大于等于 min，小于等于 max

1. 'name|count': array

> 通过重复属性值 array 生成一个新数组，重复次数为 count

### 6.属性值是函数

1. 'name': function

> 执行函数 function，取其返回值作为最终的属性值，函数的上下文为属性 'name' 所在的对象

### 7.属性值是正则表达式

1. 'name': regexp

> 根据正则表达式 regexp 反向生成可以匹配它的字符串。用于生成自定义格式的字符串

### 数据占位符定义

1. 用 @ 来标识其后的字符串是 占位符
2. 占位符 引用的是 Mock.Random 中的方法
3. 通过 Mock.Random.extend() 来扩展自定义占位符
4. 占位符 也可以引用 数据模板 中的属性
5. 占位符 会优先引用 数据模板 中的属性
6. 占位符 支持 相对路径 和 绝对路径

## Mock.setup()

> 配置 Ajax 请求的行为，暂时支持的配置项有 timeout

```js
Mock.setup({
  timeout: 500,
})
Mock.setup({
  timeout: '100-600',
})
```

## Mock.Random

```js
const Random = Mock.Random
Random.email() // => sd.sdf@oksd.com
Mock.mock('@email') // => sd.sdf@oksd.com
Mock.mock({ email: 'sd.sdf@oksd.com' }) // => { email: "sd.sdf@oksd.com" }
```

### Mock.Random 提供的完整方法（占位符）:

| Type          | Method                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Basic         | boolean, natural, integer, float, character, string, range, date, time, datetime, now             |
| Image         | image, dataImage                                                                                  |
| Color         | color                                                                                             |
| Text          | paragraph, sentence, word, title, cparagraph, csentence, cword, ctitle                            |
| Name          | first, last, name, cfirst, clast, cname                                                           |
| Web           | url, domain, email, ip, tld                                                                       |
| Address       | area(region, province, city(bool), county(bool), zip), region                                     |
| Helper        | capitalize(首字母大写), upper(大写), lower(小写), pick(从数组任取一个), shuffle(打乱数组元素顺序) |
| Miscellaneous | guid, id                                                                                          |

### Basic

1. Random.boolean(min?, max?, current? )
2. Random.natural(min?, max? )
3. Random.integer(min?, max? )
4. Random.float( min?, max?, dmin?, dmax? )
5. Random.character( pool? ) // pool => lower/upper/number/symbol
6. Random.string( pool?, min?, max? ) // pool => lower/upper/number/symbol
7. Random.range( start?, stop, step? )

### Date

1. Random.date( format? )

| Format | Description                                              | Example      |
| ------ | -------------------------------------------------------- | ------------ |
| yyyy   | A full numeric representation of a year, 4 digits        | 1999 or 2003 |
| yy     | A two digit representation of a year                     | 99 or 03     |
| y      | A two digit representation of a year                     | 99 or 03     |
| MM     | Numeric representation of a month, with leading zeros    | 01 to 12     |
| M      | Numeric representation of a month, without leading zeros | 1 to 12      |
| dd     | Day of the month, 2 digits with leading zeros            | 01 to 31     |
| d      | Day of the month without leading zeros                   | 1 to 31      |
| HH     | 24-hour format of an hour with leading zeros             | 00 to 23     |
| H      | 24-hour format of an hour without leading zeros          | 0 to 23      |
| hh     | 12-hour format of an hour without leading zeros          | 01 to 12     |
| h      | 12-hour format of an hour with leading zeros             | 1 to 12      |
| mm     | Minutes, with leading zeros                              | 00 to 59     |
| m      | Minutes, without leading zeros                           | 0 to 59      |
| ss     | Seconds, with leading zeros                              | 00 to 59     |
| s      | Seconds, without leading zeros                           | 0 to 59      |
| SS     | Milliseconds, with leading zeros                         | 000 to 999   |
| S      | Milliseconds, without leading zeros                      | 0 to 999     |
| A      | Uppercase Ante meridiem and Post meridiem                | AM or PM     |
| a      | Lowercase Ante meridiem and Post meridiem                | am or pm     |
| T      | Milliseconds, since 1970-1-1 00:00:00 UTC                | 759883437303 |

1. Random.time( format? )
2. Random.datetime( format? )
3. Random.now( unit?, format? ) // unit => year、month、week、day、hour、minute、second、week

### Image

1.Random.image()

1. Random.image()
2. Random.image( size )
3. Random.image( size, background )
4. Random.image( size, background, text )
5. Random.image( size, background, foreground, text )
6. Random.image( size, background, foreground, format, text )

2.Random.dataImage()

1. Random.dataImage()
2. Random.dataImage( size )
3. Random.dataImage( size, text )

3.Color

1. Random.color() // => #3538B2
2. Random.hex() // => #3538B2
3. Random.rgb() // => rgb(242, 198, 121)
4. Random.rgba() // => rgba(242, 198, 121, 0.13)
5. Random.hsl() // => hsl(345, 82, 71)

4.Text

1. Random.paragraph( min?, max? )
2. Random.cparagraph( min?, max? )
3. Random.sentence( min?, max? )
4. Random.csentence( min?, max? )
5. Random.word( min?, max? )
6. Random.cword( pool?, min?, max? )
7. Random.title( min?, max? )
8. Random.ctitle( min?, max? )

5.Name

1. Random.first()
2. Random.last()
3. Random.name( middle? )
4. Random.cfirst()
5. Random.clast()
6. Random.cname()

6.Web

1. Random.url( protocol?, host? )
2. Random.protocol()
3. Random.domain() // 域名
4. Random.tld() // 顶级域名
5. Random.email( domain? )
6. Random.ip()

7.Address

1. Random.region()
2. Random.province()
3. Random.city( prefix? )
4. Random.county( prefix? )
5. Random.zip()

8.Helper

1. Random.capitalize( word )
2. Random.upper( str )
3. Random.lower( str )
4. Random.pick( arr )
5. Random.shuffle( arr )

9.Miscellaneous

1. Random.guid()
2. Random.id()
3. Random.increment( step? )

### 扩展

```js
Random.extend({
  fruit() {
    const fruit = ['apple', 'peach', 'lemon']
    return this.pick(fruit)
  },
})
Random.fruit() // => 'peach'
Mock.mock('@fruit') // => 'lemon'
Mock.mock({
  fruit: '@fruit', // => 'peach'
})
```

### Mock.valid()

Mock.valid( template, data )

### Mock.toJSONSchema()

Mock.toJSONSchema( template )
