ui-module
==================
基于requirejs
angular模块式开发，按需加载模块, 根据模块延迟加载

使用ui-module自动加载模块(模块有controller、template、directive等)

配合ng-router或ui-router, 只需要把模板改成&lt;div ui-module="xxx/XXX" ui-loading&gt;&lt;/div&gt;
```
ui-module 		是requirejs  define的模块，返回必须是函数

ui-loading		显示loading动画(模块加载完成前)
```

用法
-----
**1.引入ui-module.js文件**

**2.页面或模板**
```html
	<h2>登录模块</h2>
	<div ui-module="user/Login"></div>

	<h2>用户列表模块</h2>
	<div ui-module="user/UserList" ui-loading></div>


```	
**3.js调用**
```js
	var app = angular.module('app', ['ui-module']);
	angular.bootstrap(document.body, ['app']);
```

Demo
-----
sdemo/index.html


更多demo 请访问<a href="http://www.sdemo.cn">SDemo</a> (<a href="http://www.sdemo.cn">www.sdemo.cn</a>)
-----