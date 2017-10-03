## 构造函数与 new 命令

### 1. 对象是什么

面向对象编程（Object Oriented Programming，缩写 OOP） 是目前主流的编程范式，它将真实世界各种复杂的关系，抽象为一个个对象，然后由对象之间的分工与合作，完成对真实世界的模拟。

- 对象是单个实物的抽象
- 对象是一个容器，封装了属性（property）和方法（method）



###  2. 构造函数

面向对象编程的第一步，就是要生成对象。

构造函数的写法就是一个普通的函数，但是有自己的特征和用法。

```javascript
var Vehicle = function () {
    this.price = 10000
}
```

上面代码中，`Vehicle` 就是构造函数，它提供模板，用来生成实例对象。

构造函数的特点有两个

- 函数体内部使用了 `this`  关键字，代表了所要生成的对象实例。
- 生成对象的时候，必须用 `new` 命令，调用 `Vehicle` 函数。

> 为了与普通函数区别，构造函数名字的第一个字母通常大写。



### 3. new命令

#### 3.1 基本用法

`new` 命令的作用，就是执行构造函数，返回一个实例对象。

``` javascript
// 以 Vehicle 构造函数为例，生成一个新的实例对象
var v = new Vehicle()
v.price // 10000
```

新生成实例对象 `v` ，从构造函数 `Vehicle` 继承了 `price` 属性。 



使用 `new` 命令时，根据需要，构造函数也可以接受参数。

``` javascript
var  Vehicle = function (p) {
    this.price = p
}

var v = new Vehicle(5000)
var x = new Vehicle(10000)
```



`new` 命令本身就可以执行构造函数，所以后面的构造函数可以带括号，也可以不带括号。

``` javascript
// 以下两行代码的作用是完全一样的
var v = new Vehicle()
var v = new Vehicle
```



如果在调用构造函数时忘记使用 `new` ，会如何？

``` javascript
var  Vehicle = function (p) {
    this.price = p
}

var v = Vehicle(5000)
v.price 
// Uncaught TypeError: Cannot read property 'price' of undefined

price 
// 5000
```

从上面代码可以看到，不加 `new`  时 `Vehicle` 构造函数就变成了普通函数， `this` 指向的是全局对象，所以 `price` 变成了全局对象，而 `v` 并没有被赋予任何的值。

因此，应该非常小心，避免出现不使用 `new` 命令、直接调用构造函数的情况。为了保证构造函数必须与 `new` 命令一起使用，一个解决办法是，在构造函数内部使用严格模式，即第一行加上 `use strict` 。

另一个解决办法，是在构造函数内部判断是否使用 `new` 命令，如果发现没有使用，则直接返回一个实例对象。

``` javascript
function Fubar (foo, bar) {
    if(!(this instanceof Fubar)) {
        return new Fubar(foo, bar);
    }
  
  this._foo = foo;
  this._bar = bar;
}

Fubar(1, 2)._foo // 1
(new Fubar(1, 2))._foo // 1
```



#### 3.2 new 命令的原理

使用 `new` 命令时，函数调用的方式和步骤

- 创建一个空对象，作为将要返回的对象实例。
- 将这个空对象的原型，指向构造函数的 `prototype` 属性。
- 将这个空对象赋值给函数内部 `this` 关键字
- 开始执行构造函数内部代码

构造函数内部， `this` 指向的是新生成的空对象，所有针对 `this` 的操作，都会发生在空对象上。构造函数之所以叫“构造函数”，就是说这个函数的目的，就是操作一个空对象（即 `this` 对象 ），将其构造为需要的样子。

如果构造函数内部有 `return` 语句，而且 `return` 后面跟着一个对象， `new` 命令会返回 `return` 语句指定的对象；如果不是对象，则不会管 `return` 语句，返回 `this` 对象。

``` javascript
var Vehicle = function () {
    this.price = 1000;
  	return 1000;
}
(new Vehicle()) === 1000; // false
```

如果对普通函数（内部没有 `this` 关键字的函数 ）使用 `new` 命令，则会返回一个空对象。

``` javascript
function getMessage () {
    return 'this is a message';
}
var msg = new getMessage();
msg // {}
typeof msg // "object" - 此处原文是 // "Object" 应该是有误，typeof返回的类型都是小写，待进一步确认
```

`new` 命令简化的内部流程，可以用下面的代码标示。

``` javascript
function _new ( constructor, param) {
    var args = [].splice.call(arguments);
  	var constructor = args.shift();
    var context = Object.create(constructor.prototype);
  	var result = constructor.apply(context, args);
  	return (typeof result === 'object' && result !== null) ? result : context;
}
```



#### 3.3 new.target

函数内部可以使用 `new.target` 属性。如果当前函数是 `new` 命令调用， `new.target` 指向当前函数，否则为 `undefined` 

``` javascript
function f () {
    console.log( new.target === f );
}
f() // false
new f() // true
```

使用这个属性，可以判断函数调用的时候，是否使用 `new` 命令。

``` javascript
function f () {
    if (!new.target) {
        throw new Error('请使用 new 命令调用！');
    }
}
f();
```

#### 3.4 使用 Object.create() 创建实例对象

构造函数作为模板，可以生成实例对象。但是，有时只能拿到实例对象，而该对象根本就不是由构造函数生成的， 这时可以使用 `Object.create()` 方法，直接以某个实例对象作为模板，生成一个新的实例对象

``` javascript
var person1 = {
    name: '张三',
  	age: 38,
  	greeting: function () {
        console.log('Hi! I\'m ' + this.name + '.')
    }
}
var person2 = Object.create(person1);
person2.name // 张三
person2.greeting() // Hi! I'm 张三
```



> 本文来自阮一峰老师的[《JavaScript 标准参考教程（alpha）》](http://javascript.ruanyifeng.com)第四章[面向对象编程](http://javascript.ruanyifeng.com/#oop) 的 [ 构造函数和new命令](http://javascript.ruanyifeng.com/oop/basic.html)章节的学习笔记。

