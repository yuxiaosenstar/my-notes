---
title: Html5 history对象详解
sidebar: 'auto'
---

### 作用

history 接口允许操作浏览器的曾经在标签页或者框架里访问的会话历史记录。window.history: 返回当前会话的 history 状态。

### 属性

- history.length

只读,返回一个整数，该证书表示会话历史中元素的数目，包括当前加载的页。

- history.scrollRestoration

滚动恢复属性允许 web 应用程序在历史导航上显式地设置默认滚动恢复行为。该属性有两个可选值，默认为 auto，将恢复用户已滚动到的页面上的位置。另一个值为：manual，不还原页上的位置，用户必须手动滚动到该位置。

这个属性在 vue-router 中设置了 scrollBehavior 属性的时候，会将 history.scrollRestoration 设置为 “manual”。

- history.state

只读，表示历史堆栈顶部的状态的值。当通过浏览器存在前进后退的操作时，会触发 popState 事件，且会将该 state 携带回来。

### 方法

- history.back()

在浏览器里是里前往上一页，用户可以点击浏览器左上角的返回。等价于 history.go(-1);当浏览器会话历史记录处于第一页时调用此方法没有效果，而且也不会报错。

- history.forward()

在浏览器记录记录里前往下一页，用户可点击浏览器左上角的前进。等价于 history.go(1);

- history.go( param )

通过当前页面的相对位置从浏览器历史记录(会话记录)加载页面。

(1) 如果 param 为 0 或者不传，则重新载入当前页面。
(2) 如果 param 为正数，则查找当前页前面的历史记录，并且前进到对应页面。（之所以有正数的情形，其实是因为页面回退过。）
(3) 如果 param 为负数，则查找当前页后面的历史记录，并且后退到对应页面。

- history.pushState(state, title, url);

history.pushState()方法向浏览器历史栈添加了一个状态(增加一个记录)。pushState()方法带有三个参数：一个状态对象、一个标题(现在被忽略了)以及一个可选的 URL 地址

(1) state object —— 状态对象是一个由 pushState()方法创建的、与历史纪录相关的 javascript 对象。当用户定向到一个新的状态时，会触发 popstate 事件。事件的 state 属性包含了历史纪录的 state 对象。如果不需要这个对象，此处可以填 null。
(2) title —— 新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填 null。

- history.replaceState(object, title, url) 与 pushState 的唯一区别在于该方法是替换掉 history 栈顶元素

### 事件

- popstate 事件：popstate 事件会在以下的情况触发：
  同一个文档的浏览历史发生变化时触发。调用 history.pushState()和 history.replaceState()方法不会触发。而用户点击浏览器的前进/后退按钮时会触发，调用 history 对象的 back()、forward()、go()方法时，也会触发。popstate 事件的回调函数的参数为 event 对象，该对象的 state 属性为随状态保存的那个对象。

### 结论

- window.history 对象是不可变的
- history.length 并不会无限大,最大为 50
- 使用 location.href 跳转后页面会发起新的文档请求，而 history.pushState 不会。
- location.href 可以跳转到其他域名，而 history 不能。
- location.href 与 history 都会往历史列表中添加一条记录。
- 从 A 域名跳转到了 B 域名，那么调用 history.back()会回到 A 域名
- 因为 location.href 是刷新式的跳转，所以这个打印信息是肯定打印不出来的，在刷新的时候这个监听函数就已经失效了，所以这里不讨论 location.href 会不会触发 popstate 事件。跟 location.href 类似的还有 history.go(0)，因为 history.go(0)也会直接刷新页面，所以这个监听函数也会失效，也不会打印出信息。
- location.hash 是会触发 popstate 事件的，同样会触发 popstate 的还有 history.back，history.forward，history.go。
- history.pushState，history.replaceState 都不会触发 popstate 事件。
