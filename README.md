# Calenda

> A time selection plug-in for a mobile terminal

## Build Setup

```
1. install dependencies
npm install（npm i/cnpm i）

2. server with hot reload at localhost:8080
npm run dev

3. build for production with minification
npm run build
```

## Introduction ##
### opts parameter ###
```typescript
{
	el: '',					// string, 同css选择器, eg: '#calendar', default: '#calendar'
	format: 'yyyy-MM-dd',   // string, 设置的日期格式, default: 'yyyy-MM-dd', 可选'yyyy-MM', 'yyyy'
	range: 100,				// number, 年数的范围, default: 100, 最小为3
	readonly: true,			// boolean, 是否只读(只有当节点为input时有效), default: true
	onCancel: null,			// function, default: null, 设置后可在点击取消时先执行自定义的回调, 再隐藏
	onConfirm: null			// function, default: null, 设置后可在点击确定时先执行自定义的回调, 才隐藏	
}
```
### Usage ###
**可参考dist目录下的index.html**
1. html文件需引入相关文件, 同时需包含一个dom节点, 例如：
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0"/>
	<title>移动端时间选择插件</title>
	<link href="./css/calendar.min.css" rel="stylesheet">
</head>
<body>
	<input type="" name="" id = "calendar">
	<script type="text/javascript" src="./js/calendar.min.js"></script>
</body>
</html>
```
2. 在创建并且引入你自己的js文件后, 记得在你自己的文件中添加如下代码
```javascript
new Calendar();
// 或者自定义配置参数
new Calendar({
	el: '#calendar',
	range: 50,
	...
});
```
3. src目录下的calendar.js文件为之前的es6写法, 所以使用es6的童鞋也是可以使用的, 至于怎么引入使用就不用说了吧^_^

### Other instructions ###
>最近在慢慢入坑ts, 所以将之前用 es6 写的插件改成了ts, 已经2018了如果你还不会 es6 的话, 赶紧偷偷的去看看吧, 这里推荐阮一峰老师的[es6入门教程](http://es6.ruanyifeng.com/). webpack方面, 由于近期webpack官方升级到了v4, 所以这边的版本也是最新的v4版, 虽说配置方面简化了很多, 不过依然是全程手动配置. ts方面也还有很多不懂的, 写的也不是很好, 只能通过练习来慢慢熟悉. 手机端的一款小插件, **chrome下记得切换为手机模式查看！**