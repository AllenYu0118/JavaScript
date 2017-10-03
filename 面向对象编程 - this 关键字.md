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

由于 `this` 的指向是不明确的，所以切勿在函数中包含多层的 `this` 。

```javascript
var o = {
    f1: function () {
        console.log(this);
      	var f2 = function () {
            console.log(this);
        }();
    }
}
o.f1();
// Object 
// window
```

上面代码中包含两层 `this` ，结果运行后，第一层指向该对象，第二层指向全局对象。

实际执行的是下面的代码

```javascript
var f2 = function () {
    console.log(this);
}
var o = {
    f1: function () {
        console.log(this);
      	f2();
    }
}
```

一个解决方法是在第二层改用一个指向外层 `this` 的变量。

```javascript
var o = {
    f1: function () {
        console.log(this);
      	var that = this;
      	var f2 = function () {
            console.log(that);
        }(); 
    }
}
o.f1()
// Object
// Object
```

上面的代码定义了变量 `that` ，固定指向外层 `this` ，然后在内层使用 `that` ，就不会发生 `this` 指向的改变。

JavaScript 提供了严格模式，也可以硬性避免这种问题。在严格模式下，如果函数内部的 `this` 指向顶层对象，就会报错。

``` javascript
var counter = {
    count: 0
}
counter.inc = function () {
    'use strict'
  	this.count++ 
};
var f = counter.inc;
f(); // TypeError: Cannot read property 'count' of undefined
```

##### (2) 避免数组处理方法中的this

数组的 `map` 和 `forEach` 方法，允许提供一个函数作为参数。这个函数内部不应该使用 `this` 。

```javascript
var o = {
    v: 'hello',
  	p: ['a1', 'a2'],
  	f: this.p.forEach(function(item){
        console.log(this.v + '' + item);
    })
}
o.f();
// undefined a1
// undefined a2
```

上面的代码中， `forEach` 方法的回调函数中的 `this` ，其实指向的是 `window` 对象，因此取不到 `o.v` 的值。

解决这个问题的方法和上面增加 `that` 中间变量的方法一样。

另一种方法是将 `this` 当做 `forEach` 方法的第二个参数，固定它的运行环境。

```javascript
var o = {
    v: 'hello',
  	p: ['a1', 'a2'],
  	f: this.p.forEach(function(item){
        console.log(this.v + '' + item);
    }, this)
}
o.f();
// hello a1
// hello a2
```

##### (3) 避免回调函数中的this

回调函数的 `this` 往往会改变指向，最好避免使用。

```javascript
var o = new Object();
o.f = function () {
    console.log(this === o);
}
o.f(); // true

// 对element绑定click事件
element.onClick = function () {
    o.f();
}
// false
```

以上对 `element` 绑定的 `click` 方法， 此时 `o.f` 中的 `this` 指向的是 `element` 



#### 4. 绑定 this 的方法

`this` 的动态切换，固然为JavaScript创造了巨大的灵活性，但也使得编程变得困难和模糊。有时，需要把 `this` 固定下来，避免出现意想不到的情况。JavaScript提供了 `call` 、 `apply` 、 `bind` 这三个方法，来切换/固定 `this` 的指向。

##### 4.1 function.prototype.call()

函数实例的 `call` 方法，可以指定函数内部的 `this` 的指向（即函数执行时所在的作用域），然后在所指定的作用域中，调用该函数。

```javascript
var obj = {};
var f = function () {
    return this;
}
f() === this; // true
f.call(obj) === obj; // true
```

在上面的方法中，在全局环境运行函数 `f` 时， `this` 指向全局环境； `call` 方法可以改变 `this` 的指向，指定 `this` 指向对象 `obj` ，然后在对象 `obj` 的作用域中运行函数 `f` 。

`call` 方法的参数应该是一个对象。如果参数为空、 `null` 和 `undefined` ，则默认传入全局对象。

如果 `call` 方法的参数是一个原始值，那么这个原始值会自动转成对应的包装对象，然后传入 `call` 方法。

```javascript
var f = function () {
    return this;
}
f.call(5); // Number {[[PrimitiveValue]]: 5}
```

上面的代码中， `call` 的参数是 `5` ，不是对象，会被自动转成包装对象（ `Number` 的实例 ），绑定 `f` 内部的 `this` 。

`call` 方法还可以接受多个参数

```javascript
func.call(thisValue, arg1, arg2, ...)
```

`call` 的第一个参数就是 `this` 所要指向的对象，后面的参数则是函数调用时需要的参数。

```javascript
function add (a, b) {
    return a + b;
}
add.call(this, 1, 2); // 3
```

`call` 方法的一个应用是调用对象的原生方法。

```javascript
var obj = {};
obj.hasOwnProperty('toString'); // false

// 覆盖掉继承的 hasOwnProperty 方法
obj.hasOwnProperty = function () {
    return true;
}
obj.hasOwnProperty('toString'); // true

Object.prototype.hasOwnProperty(obj, 'toString'); // false
```

上面的代码中， `hasOwnProperty` 是 `obj` 对象继承的方法，如果这个方法一旦被覆盖，就不会得到正确结果。 `call` 方法可以解决这个问题， 它将 `hasOwnProperty` 方法的原始定义放到 `obj` 对象上执行，这样无论 `obj` 上有无同名方法，都不会影响结果。

##### 4.2 function.prototype.apply()

`apply` 方法与 `call` 方法类似，也是改变 `this` 的指向，然后再调用该函数。唯一的区别就是，它接收一个数组作为一个函数执行时的参数，使用格式如下。

```javascript
func.apply(thisValue, [arg1, arg2, arg3, ...])
```

`apply` 方法的第一个参数也是 `this` 所要指向的那个对象，如果设为 `null` 和 `undefined` ，则等同于指定全局对象。第二个参数则是一个数组，该数组的所有成员依次作为参数，传入原函数。原函数的参数，在 `call` 方法中必须一个个添加，但是在 `apply` 方法中，必须以数组形式添加。

```javascript
function f (x, y) {
    console.log(x+y)
}
f.call(null,1,2);  // 3
f.apply(null,[1,2]); // 3
```

上面的 `f` 函数本来接收两个参数，使用 `apply` 方法以后，就变成可以接受一个数组作为参数。

利用这一点可以做一些有趣 的应用。

###### (1) 找出数组中最大的元素

JavaScript 不提供找出数组最大元素的函数。结合使用 `apply` 方法和 `Math.max` 方法，就可以返回数组的最大元素。

```javascript
var arr = [10, 4, 8, 12, 17, 24, 9];
Math.max.apply(null, arr); // 24
```

###### (2) 将数组的空元素变成 undefined

通过 `apply` 方法，利用 `Array` 构造函数将数组的空元素变成 undefined

```javascript
Array.apply(null, ['a', , 'b']);
// ["a", undefined, "b"]
```

空元素与 `undefined` 的差别在于，数组的 `forEach` 方法会跳过空元素，但是不会跳过 `undefined` 。因此，遍历内部元素的时候，会得到不同的结果。

```javascript
var arr = ['a',, 'b'];
function print(i) {
    console.log(i);
}
a.forEach(print);
Array.apply(null, arr).forEach(print);
```

###### (3) 转换类似数组的对象

利用数组对象的 `slice` 方法，可以将一个类似数组对象转为真正的数组。

```javascript
Array.prototype.slice.apply({0:1,length:1})
// [1]

Array.prototype.slice.apply({0:1})
// []

Array.prototype.slice.apply({0:1,length:2})
// [1, undefined]

Array.prototype.slice.apply({length:1})
// [undefined]
```

上面代码的 `apply` 方法的参数都是对象，但是返回结果都是数组，这就起到了将对象 转成数组的目的。从上面代码可以看出，这个方法起作用的前提，被处理的对象必须有 `length` 属性，以及相对等的数字键。

##### function.prototype.bind()

`bind` 方法用于将函数体内的 `this` 绑定到某个对象，然后返回一个新函数。





















> 本文来自阮一峰老师的[《JavaScript 标准参考教程（alpha）》](http://javascript.ruanyifeng.com)第四章[面向对象编程](http://javascript.ruanyifeng.com/#oop) 的 [ this 关键字](http://javascript.ruanyifeng.com/oop/this.html)章节的学习笔记。