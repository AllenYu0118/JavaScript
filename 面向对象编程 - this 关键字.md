# 面向对象编程 - this 关键字

#### 1. 涵义

`this` 关键字是一个非常重要的语法点。毫不夸张的说，不理解它的含义，大部分开发任务都无法完成。

```javascript
var person = {
    name: '小鱼',
  	describe: function () {
        return '姓名：' + this.name;
    }
};
person.describe(); // 姓名：小鱼
```

上面的代码中，`this.name` 表示 `describe` 方法所在的当前对象的 `name` 属性。调用 `person.describe` 方法时， `describe` 方法所在的当前对象是 `person` ，所以就是调用 `person.name` 。

由于对象的属性可以赋给另一个对象，所以属性所在的当前对象是可变的，即 `this` 的指向是可变的。

```javascript
var A = {
    name: '小熊',
  	describe: function () {
        return '姓名：' + this.name;
    }
};
var B = {
    name: '维尼熊'
};

B.describe = A.describe;
B.describe(); // 姓名：维尼熊
```

只要函数被赋给另个变量， `this` 的指向就会变。

```javascript
var A = {
    name: '小熊',
  	describe: function () {
        return '姓名：' + this.name;
    }
}

var name = '小浣熊';
var f = A.describe;
f() // 姓名：小浣熊
```

总结一下，JavaScript 语言之中，一切皆对象，运行环境也是对象，所以函数都是在某个对象之中运行， `this` 就是这个对象（环境）。



#### 2. 使用场合

##### (1)全局环境

在全局环境中使用 `this` ，它指向的就是顶层对象 `window` 。

```javascript
this === window; // true
function f () {
    console.log(this === window); // true
}
```

上面的代码说明，不管是不是在函数内部，只要是在全局环境下运行， `this` 就是指顶层对象 `window` 。

##### (2) 构造函数

构造函数中的 `this` ， 指的是实例对象。

```javascript
var Obj = function (p) {
    this.p = p;
}
Obj.prototype.m = function () {
    return this.p;
}
```

上面的代码定义了一个构造函数 `Obj` ，由于 `this` 指向实例对象，所以在构造函数内部定义 `this.p` ， 就相当于定义实例对象有一个 `p` 属性，然后 `m` 方法可以返回这个 `p` 属性。

```javascript
var o = new Obj('Hello World!')；
o.p // Hello World!
o.m() // Hello World!
```





























> 本文来自阮一峰老师的[《JavaScript 标准参考教程（alpha）》](http://javascript.ruanyifeng.com)第四章[面向对象编程](http://javascript.ruanyifeng.com/#oop) 的 [ this 关键字](http://javascript.ruanyifeng.com/oop/this.html)章节的学习笔记。