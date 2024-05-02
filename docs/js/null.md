---
title: JavaScript中的“null”与“undefined“
sidebar: 'auto'
---

> - undefined 是全局对象的一个属性。也就是说，它是全局作用域的一个变量。undefined 的最初值就是原始数据类型 undefined。
> - 值 null 是一个字面量，不像 undefined，它不是全局对象的一个属性。null 是表示缺少的标识，指示变量未指向任何对象。

undefined 由于是全局的属性，其实是一个对象来处理，而对象进行转换的时候，是当做 NaN。

而 null 与空字符串都是字面量，并且都是表示没有数据，在 ascii 码中，都是 000000，所以转换成数据就是 0 本身。
