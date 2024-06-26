---
title: 节流和防抖的区别，以及如何实现
sidebar: 'auto'
---

## 防抖

> 触发高频事件后 n 秒内函数只会执行一次，如果 n 秒内高频事件再次被触发，则重新计算时间

- 实现方式：每次触发事件时设置一个延迟调用方法，并且取消之前的延时调用方法
- 缺点：如果事件在规定的时间间隔内被不断的触发，则调用方法会被不断的延迟

```js
//防抖debounce代码：
function debounce(fn) {
  let timeout = null // 创建一个标记用来存放定时器的返回值
  return function () {
    // 每当用户输入的时候把前一个 setTimeout clear 掉
    clearTimeout(timeout)
    // 然后又创建一个新的 setTimeout, 这样就能保证interval 间隔内如果时间持续触发，就不会执行 fn 函数
    timeout = setTimeout(() => {
      fn.apply(this, arguments)
    }, 500)
  }
}
// 处理函数
function handle() {
  console.log(Math.random())
}
// 滚动事件
window.addEventListener('scroll', debounce(handle))
```

## 节流

> 高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率

- 实现方式：每次触发事件时，如果当前有等待执行的延时函数，则直接 return

```js
//节流throttle代码：
function throttle(fn) {
  let canRun = true // 通过闭包保存一个标记
  return function () {
    // 在函数开头判断标记是否为true，不为true则return
    if (!canRun) return
    // 立即设置为false
    canRun = false
    // 将外部传入的函数的执行放在setTimeout中
    setTimeout(() => {
      // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。
      // 当定时器没有执行的时候标记永远是false，在开头被return掉
      fn.apply(this, arguments)
      canRun = true
    }, 500)
  }
}

function sayHi(e) {
  console.log(e.target.innerWidth, e.target.innerHeight)
}
window.addEventListener('resize', throttle(sayHi))
```

总结：

_函数防抖_：将多次操作合并为一次操作进行。原理是维护一个计时器，规定在 delay 时间后触发函数，但是在 delay 时间内再次触发的话，就会取消之前的计时器而重新设置。这样一来，只有最后一次操作能被触发。

_函数节流_：使得一定时间内只触发一次函数。原理是通过判断是否有延迟调用函数未执行。

区别： 函数节流不管事件触发有多频繁，都会保证在规定时间内一定会执行一次真正的事件处理函数，而函数防抖只是在最后一次事件后才触发一次函数。 比如在页面的无限加载场景下，我们需要用户在滚动页面时，每隔一段时间发一次 Ajax 请求，而不是在用户停下滚动页面操作时才去请求数据。这样的场景，就适合用节流技术来实现。
