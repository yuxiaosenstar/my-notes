# 关于element form的表单验证

最近表单模块写的比较多，关于element的form表单验证，这里做个详细的归纳和总结。

首先附上参数说明：

| 属性 | 类型 | 说明 |
| ---- | ---- | ---- |
| type | String | 用于验证数据类型，默认类型为’string’,常用格式封装包括:email、url、regexp、method |
| required | boolean | 是否必填 |
| pattern | regexp/string | 字段值匹配正则表达式才能通过验证 |
| min和max | number | 对于字符串和数组类型，将根据长度进行比较，对于数字类型，数字不得小于min，也不得大于max |
| len | number | 对于字符串和数组类型，对length属性执行比较，对于数字类型，此属性指示数字的完全匹配，len属性与min和max属性组合，则len优先。|
| enum | array | type必须设置为enum，值必须包含在从可能值列表中才能通过验证 |
| whitespace | boolean | type必须设置为string，要为仅包含空格的字符串可以将whitespace设置为true | 
| transform | function | 在验证之前转换值
defaultField | array/object | type为数组或对象类型时一起使用，用来验证数组或对象中包含的所有值，进行深层验证 
| fields | object | type为数组或对象类型时一起使用，分别验证array/object类型的数据中的值，实现深度验证 | 
| validator | function | 验证器，可以为指定字段自定义验证函数：function(rule, value, callback) |
| message | string | 根据需要将消息分配给规则 |

