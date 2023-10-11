---
title: 树形结构扁平化
sidebar: 'auto'
---


原理是利用递归方式实现遍历数组，存在children则递归调用

```js
// 测试数据
let tree = [
    {
        "id": 1,
        "name": "部门1",
        "pid": 0,
        "children": [
            { "id": 2, "name": "部门2", "pid": 1, "children": [] },
            {
                "id": 3, "name": "部门3", "pid": 1, "children": [
                    {
                        "id": 4, "name": "部门4", "pid": 3, "children": [
                            { "id": 5, "name": "部门5", "pid": 4, "children": [] }
                        ]
                    }
                ]
            }
        ]
    }
]
// 测试数据1
let tree1 = [
    {
        "id": 6, "pid": 30, "text": "B", "children": [
            { "id": 5, "pid": 6, "text": "D[父B]", "children": [] }
        ]
    },
    {
        "id": 1, "pid": 20, "text": "A", "children": [
            {
                "id": 4, "pid": 1, "text": "C[父A]", "children": [
                    {
                        "id": 7, "pid": 4, "text": "F[父C]", "children": [
                            { "id": 3, "pid": 7, "text": "G[父F]", "children": [] }
                        ]
                    },
                    { "id": 2, "pid": 4, "text": "E[父C]", "children": [] }]
            }]
    }]

function flatTree(list) {
    return list.reduce((ls, item) => {
        let { children, ...res } = item
        if (children && children.length) {
            return ls.concat(res, flatTree(children))
        } else {
            return ls.concat(res)
        }
    }, [])
}

flatTree(tree)
```

