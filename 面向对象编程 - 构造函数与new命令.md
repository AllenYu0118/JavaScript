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