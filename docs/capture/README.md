---
title: 浅谈两种前端截图方式：Canvas 截图 vs SVG 截图
sidebar: 'auto'
---

## 背景

如今很多网站都引入截图功能，可用于问题反馈、内容分享等实用需求，而前端截图也不知不觉成为了首选。今天为大家推荐两种前端截图方式，虽然有些局限，但是也能应付大部分项目需求。

- Canvas 截图：html2canvas
- SVG 截图：rasterizehtml

## 原理

首先来谈下两种前端截图方式的原理，虽然实现方式不太一致，但是核心思想是相同的。

以 html2canvas 为代表的 Canvas 截图，通过遍历 DOM 克隆一份副本，将此副本在 Canvas 上重新绘制，并根据 DOM 的样式应用在对应的绘制元素上，再通过 Canvas 生成图片。转换过程可理解成：DOM→Canvas→Image。

以 rasterizehtml 为代表的 SVG 截图，通过遍历 DOM 克隆一份副本，利用 SVG 的 foreignObject 把 DOM 作为外部资源嵌套在 SVG 中，将此 SVG 在 Canvas 上重新绘制，并根据 DOM 的样式应用在对应的绘制元素上，再通过 Canvas 生成图片。转换过程可理解成：DOM→SVG 的 ForeignObject→Canvas→Image。

两种前端截图方式最后都是通过把 DOM 绘制到 Canvas，再通过 Canvas 输出图片。

## 限制

虽然两种前端截图方式都有这两个封装得比较完善的第三方库 html2canvas 和 rasterizehtml，但是由于在转换过程中存在一些自身的局限性，所以也导致截图可能出现一些不完美的问题。

> Canvas 截图的限制性

- 无法渲染跨域资源(支持同域)
- 无法渲染 iFrame 和 Flash 内容(支持 SVG)

> SVG 截图的限制性

- 无法渲染跨域资源(支持同域)
- 无法渲染如 lazyload 等通过 JS 加载的资源
- 无法渲染内联 background-image 或 JS 操作 background-image

## 方案

不多废话，直接上两种前端截图方式的代码，小伙伴们可根据项目需求自行优化代码和增加功能哈。

> 准备

```html
<div id="screenshot">Hello World</div>
<button id="save-btn">保存</button>
```

```js
// 渲染图片
function Render(src, width, height, cb) {
  const img = new Image()
  img.src = src
  img.width = width
  img.height = height
  img.crossOrigin = '' // 图像跨域时配置
  cb && cb(img)
}

// 下载图片
function Download(url, name) {
  const target = document.createElement('a')
  target.href = url
  target.download = name
  const event = document.createEvent('MouseEvents')
  event.initEvent('click', true, true)
  target.dispatchEvent(event)
}
```

> Canvas 截图

```js
import Html2canvas from 'html2canvas'

const btn = document.getElementById('save-btn')
btn.addEventListener('click', () => {
  const screenshot = document.getElementById('screenshot')
  // allowTaint: true, // 不能与useCORS共用
  const opts = {
    logging: false,
    scale: 2,
    useCORS: true,
  }
  Html2canvas(screenshot, opts).then(
    (res) => {
      const { height, width } = res
      const base64 = res.toDataURL('image/png', 1)
      Render(base64, width, height, (img) => {
        document.body.appendChild(img)
        Download(base64, 'screenshot.png')
      })
    },
    (err) => alert('截图失败，请重新尝试')
  )
})
```

> SVG 截图

```js
import Rasterizehtml from 'rasterizehtml'

const btn = document.getElementById('save-btn')
btn.addEventListener('click', () => {
  // drawURL()加载的URL必须是同域名URL或支持跨域的URL
  // 下面的URL是随便写的，记得换成同域名URL或支持跨域的URL
  const url = 'https://www.baidu.com'
  const canvas = document.createElement('canvas')
  const opts = {
    executeJs: true,
    height: screen.height,
    width: screen.width,
  }
  Rasterizehtml.drawURL(url, canvas, opts).then(
    (res) => {
      const base64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(res.svg)))
      Render(base64, opts.width, opts.height, (img) => {
        document.body.appendChild(img)
        Download(base64, 'screenshot.png')
      })
    },
    (err) => alert('截图失败，请重新尝试')
  )
})
```

另外还有几点需要注意一下：

- 使用 Canvas 截图兼容低版本浏览器时，不能使用 CSS3 属性和带有前缀的属性
- 使用 SVG 截图可获取同域`<iframe>`内容进行渲染
- 截图不能包含跨域获取的内容，否则不会渲染跨域内容

## 总结

浅谈两种前端截图方式就到此为止啦，相信小伙伴们对前端截图也有一个比较清晰的概念了，可结合自身项目尝试一下两种前端截图方式，探究下其相同点和不同点。如果对其截图原理感兴趣，可剖析下 html2canvas 和 rasterizehtml 的源码，相信你会有意外的收获喔！
