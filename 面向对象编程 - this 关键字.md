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

##### (3) 对象方法

当A对象的方法被赋予B对象，该方法中的this就从指向A对象变成了指向B对象。所以要特别小心，将某个对象的方法赋值给另一个对象，会改变 `this` 的指向。

```javascript
var obj = {
    foo: function () {
        console.log(this);
    }
};
obj.foo() // obj
```

上面的代码中， `obj.foo` 方法执行时，它内部的 `this` 指向 `obj`。

```javascript
// 情况一
(obj.foo = obj.foo)() // window
// 相当于
(function () {
    console.log(this);
})()

// 情况二
(false || obj.foo)() // window

// 情况三
(1, obj.foo)() // window
```

上面的代码中， `obj.foo` 先运算再执行，即使值根本没有变化， `this` 也不再指向 `obj` 了。因为这时它已经脱离运行环境 `obj` ，而在全局环境执行了。（后面这段原文很不通顺，我这里做了一定修改）。

可以这样理解，在 JavaScript 引擎内部， `obj` 和 `obj.foo` 储存在两个内存地址，简称为 `M1` 和 `M2` 。只有 `obj.foo()` 这样调用时，是从 `M1` 调用 `M2` ，因此 `this` 指向 `obj` 。但是，上面三种情况，都是直接取出 `M2` 进行运算，然后就在全局环境下执行，因此 `this` 指向全局环境。

上面三种情况等同于下面的代码

```javascript
// 情况一
(obj.foo = function () {
    console.log(this);
})()
// 等同于
(function () {
    console.log(this);
})()

// 情况二
(false || function () {
    console.log(this);
})()

// 情况三
(1, function () {
    console.log(this);
})()
```

 如果某个方法位于多层对象的内部，这时 `this` 只是指向当前一层的对象，而不会继承更上面的层。

```javascript
var a = {
    p: 'Hello',
  	b: {
        m: function () {
            console.log(this.p);
        }
    }
}
a.b.m() // undefined
```

上面代码中， `a.b.m` 方法在 `a` 对象的第三层，该方法内部的 `this` 不是指向 `a` ，而是指向 `a.b` 。这是因为实际执行的是下面的代码。

```javascript
var b = {
    m: function () {
        console.log(this.p);
    }
}
var a = {
    p: 'Hello',
  	b: p
};
(a.b).m() //等同于 b.m();
```

 上面的代码中， `m` 中的 `this` 对象指向的是 `b` ，但是 `b` 中没有 `p` 属性，所以会输出 `undefined` 。

如果要达到预期效果，可以写成下面这样

```javascript
var a = {
    b: {
        m: function () {
            console.log(this.p);
        },
      	p: 'Hello'
    }
}
```

如果这时将嵌套对象内部的方法赋值给一个变量， `this` 依然会指向全局对象。

```javascript
var hello = a.b.m;
hello(); //undefined

var hello2 = a.b;
hello2(); // Hello
```



#### 3. 使用注意点

##### (1) 避免多层 this

























> 本文来自阮一峰老师的[《JavaScript 标准参考教程（alpha）》](http://javascript.ruanyifeng.com)第四章[面向对象编程](http://javascript.ruanyifeng.com/#oop) 的 [ this 关键字](http://javascript.ruanyifeng.com/oop/this.html)章节的学习笔记。