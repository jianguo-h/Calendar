# Calendar

> 一款移动端日期选择插件

## Build Setup

```

# git clone https://github.com/jianguo-h/Calendar.git

1. install dependencies
npm install（npm i/cnpm i）

2. server with hot reload at localhost:8080
npm run dev

3. build for production with minification
npm run build

```

### 用法

1. html文件需引入相关样式和脚本文件, 同时需包含一个dom节点（**可参考dist目录下的index.html**）, 例如：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0"/>
  <title>移动端时间选择插件</title>
  <link href="./css/calendar.min.css" rel="stylesheet"></head>
<body>
  <input type="" name="" id = "calendar">
  <script type="text/javascript" src="./js/calendar.min.js"></script></body>
<script>
  document.getElementById('calendar').onclick = function() {
    new Calendar({
      el: '#calendar',
      range: 5
    });
  }
</script>
</html>
```
2. 在创建并且引入你自己的js文件后, 记得在你自己的文件中添加如下代码

```javascript
new Calendar();
// 或者自定义配置参数（见*参数说明*）
new Calendar({
	el: '#calendar',
	range: 50,
	...
});
```

3. src目录下的calendar.js文件为之前的es6写法, 所以使用es6的童鞋也是可以使用的, 至于怎么引入使用就不用说了吧^_^, **记得在chrome的手机模式下查看**

### 参数说明
<table width='100%'>
  <thead>
    <tr align='left'>
      <th>属性</th>
      <th>说明</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr align='left'>
      <td>el</td>
      <td>作用于的元素节点（必须是input标签）, 同css选择器, eg: #calendar, .calendar</td>
      <td>string</td>
      <td>#calendar</td>
    </tr>
    <tr align='left'>
      <td>format</td>
      <td>设置的日期格式,可选'yyyy-MM-dd', 'yyyy-MM', 'yyyy'</td>
      <td>string</td>
      <td>yyyy-MM-dd</td>
    </tr>
    <tr align='left'>
      <td>range</td>
      <td>年数的范围, 代表以当前时间年份为中心的前后各多少年, 最小为3</td>
      <td>number</td>
      <td>50</td>
    </tr>
    <tr align='left'>
      <td>readonly</td>
      <td>是否只读(只有当节点为input时有效)</td>
      <td>boolean</td>
      <td>true</td>
    </tr>
    <tr align='left'>
      <td>maskClose</td>
      <td>点击遮罩层是否能关闭</td>
      <td>boolean</td>
      <td>true</td>
    </tr>
    <tr align='left'>
      <td>confirmText</td>
      <td>确定按钮的文字</td>
      <td>string</td>
      <td>确定</td>
    </tr>
    <tr align='left'>
      <td>onConfirm</td>
      <td>确定的回调函数</td>
      <td>function</td>
      <td>null</td>
    </tr>
    <tr align='left'>
      <td>cancelText</td>
      <td>取消按钮的文字</td>
      <td>string</td>
      <td>取消</td>
    </tr>
    <tr align='left'>
      <td>onCancel</td>
      <td>取消的回调函数</td>
      <td>function</td>
      <td>null</td>
    </tr>
  </tbody>
</table>