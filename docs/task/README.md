---
title: 宏任务和微任务到底是什么？
sidebar: 'auto'
---


## JS运行机制

**概念1： JS是单线程执行**

”JS是单线程的” 指的是JS引擎线程。

> 在浏览器环境中，有JS 引擎线程和渲染线程，且两个线程互斥。
> Node环境中，只有JS 线程。
 
**概念2：宿主**

JS运行的环境。一般为浏览器或者Node。

**概念3：执行栈**

是一个存储函数调用的栈结构，遵循先进后出的原则。

```js
function foo() {
  throw new Error('error')
}
function bar() {
  foo()
}
bar()
```

![](media/16931497917859/16931500139644.jpg)

当开始执行 JS 代码时，首先会执行一个 **main** 函数，然后执行我们的代码。根据先进后出的原则，后执行的函数会先弹出栈，在图中我们也可以发现，**foo** 函数后执行，当执行完毕后就从栈中弹出了。

**概念4：Event Loop**

JS到底是怎么运行的呢？

![](media/16931497917859/16931500844440.jpg)

> JS引擎常驻于内存中，等待宿主将JS代码或函数传递给它。
> 也就是等待宿主环境分配宏观任务，反复等待 - 执行即为事件循环。

Event Loop中，每一次循环称为tick，每一次tick的任务如下：

* 执行栈选择最先进入队列的宏任务（一般都是script），执行其同步代码直至结束；
* 检查是否存在微任务，有则会执行至微任务队列为空；
* 如果宿主为浏览器，可能会渲染页面；
* 开始下一轮tick，执行宏任务中的异步代码（setTimeout等回调）。

**概念5：宏任务和微任务**

> ES6 规范中，microtask 称为 jobs，macrotask 称为 task
> 宏任务是由宿主发起的，而微任务由JavaScript自身发起。

在ES3以及以前的版本中，JavaScript本身没有发起异步请求的能力，也就没有微任务的存在。在ES5之后，JavaScript引入了Promise，这样，不需要浏览器，JavaScript引擎自身也能够发起异步任务了。

所以，总结一下，两者区别为：

| | 宏任务（macrotask）| 微任务（microtask）|
|---------|---------|---------|
| 谁发起的 | 宿主（Node、浏览器）| JS引擎 |
| 具体事件 | 1. script (可以理解为外层同步代码) 2. setTimeout/setInterval 3. UI rendering/UI事件 4. postMessage，MessageChannel 5. setImmediate，I/O（Node.js）| 1. Promise 2. MutaionObserver 3. Object.observe（已废弃；Proxy 对象替代） 4. process.nextTick（Node.js）|
| 谁先运行 | 后运行 | 先运行 |
| 会触发新一轮Tick吗 | 会 | 不会 |

**拓展 1：async和await是如何处理异步任务的？**

简单说，**async**是通过**Promise**包装异步任务。

比如有如下代码：

```js
async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()
```

改为ES5的写法：

```js
new Promise((resolve, reject) => {
  // console.log('async2 end')
  async2() 
  ...
}).then(() => {
 // 执行async1()函数await之后的语句
  console.log('async1 end')
})
```

当调用 **async1** 函数时，会马上输出 **async2 end**，并且函数返回一个 **Promise**，接下来在遇到 **await** 的时候会就让出线程开始执行 **async1** 外的代码（可以把 **await** 看成是让出线程的标志）。
然后当同步代码全部执行完毕以后，就会去执行所有的异步代码，那么又会回到 **await** 的位置，去执行 **then** 中的回调。

**拓展 2：setTimeout，setImmediate谁先执行？**

**setImmediate** 和 **process.nextTick** 为Node环境下常用的方法（IE11支持**setImmediate**），所以，后续的分析都基于Node宿主。

Node.js是运行在服务端的js，虽然用到也是V8引擎，但由于服务目的和环境不同，导致了它的API与原生JS有些区别，其Event Loop还要处理一些I/O，比如新的网络连接等，所以与浏览器Event Loop不太一样。

>  执行顺序如下：

1. timers: 执行setTimeout和setInterval的回调
2. pending callbacks: 执行延迟到下一个循环迭代的 I/O 回调
3. idle, prepare: 仅系统内部使用
4. poll: 检索新的 I/O 事件;执行与 I/O 相关的回调。事实上除了其他几个阶段处理的事情，其他几乎所有的异步都在这个阶段处理。
5. check: setImmediate在这里执行
6. close callbacks: 一些关闭的回调函数，如：socket.on('close', ...)

一般来说， **setImmediate** 会在 **setTimeout** 之前执行，如下：

```js
console.log('outer');
setTimeout(() => {
  setTimeout(() => {
    console.log('setTimeout');
  }, 0);
  setImmediate(() => {
    console.log('setImmediate');
  });
}, 0);
```

其执行顺序为：

1. 外层是一个setTimeout，所以执行它的回调的时候已经在timers阶段了
2. 处理里面的setTimeout，因为本次循环的timers正在执行，所以其回调其实加到了下个timers阶段
3. 处理里面的setImmediate，将它的回调加入check阶段的队列
4. 外层timers阶段执行完，进入pending callbacks，idle, prepare，poll，这几个队列都是空的，所以继续往下
5. 到了check阶段，发现了setImmediate的回调，拿出来执行
6. 然后是close callbacks，队列是空的，跳过
7. 又是timers阶段，执行console.log('setTimeout') 

但是，如果当前执行环境不是timers阶段，就不一定了。。。。顺便科普一下Node里面对 **setTimeout** 的特殊处理：**setTimeout(fn, 0)** 会被强制改为 **setTimeout(fn, 1)** 。

看看下面的例子：

```js
setTimeout(() => {
  console.log('setTimeout');
}, 0);

setImmediate(() => {
  console.log('setImmediate');
});
```

其执行顺序为：

1. 遇到 setTimeout，虽然设置的是0毫秒触发，但是被node.js强制改为1毫秒，塞入times阶段
2. 遇到 setImmediate 塞入check阶段
3. 同步代码执行完毕，进入 Event Loop
4. 先进入 times 阶段，检查当前时间过去了1毫秒没有，如果过了1毫秒，满足 setTimeout 条件，执行回调，如果没过1毫秒，跳过
5. 跳过空的阶段，进入check阶段，执行 setImmediate 回调

可见，1毫秒是个关键点，所以在上面的例子中，setImmediate 不一定在 setTimeout 之前执行了。

**拓展 3：Promise，process.nextTick谁先执行？**

因为 **process.nextTick** 为Node环境下的方法，所以后续的分析依旧基于Node。
**process.nextTick()**  是一个特殊的异步API，其不属于任何的Event Loop阶段。事实上Node在遇到这个API时，Event Loop根本就不会继续进行，会马上停下来执行process.nextTick()，这个执行完后才会继续Event Loop。
所以，**nextTick** 和 **Promise** 同时出现时，肯定是 **nextTick** 先执行，原因是 **nextTick** 的队列比 **Promise** 队列优先级更高。

**拓展 4：应用场景 - Vue中的vm.$nextTick**

**vm.$nextTick** 接受一个回调函数作为参数，用于将回调延迟到下次DOM更新周期之后执行。
这个API就是基于事件循环实现的。
“下次DOM更新周期”的意思就是下次微任务执行时更新DOM，而 **vm.$nextTick** 就是将回调函数添加到微任务中（在特殊情况下会降级为宏任务）。
因为微任务优先级太高，Vue 2.4版本之后，提供了强制使用宏任务的方法。

>  vm.$nextTick优先使用Promise，创建微任务。
> 如果不支持Promise或者强制开启宏任务，那么，会按照如下顺序发起宏任务：

1. 优先检测是否支持原生 setImmediate（这是一个高版本 IE 和 Edge 才支持的特性）
2. 如果不支持，再去检测是否支持原生的MessageChannel
3. 如果也不支持的话就会降级为 setTimeout。

**小结**

下面是道加强版的考题，大家可以试一试。

```js
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```
