# Object 对象与继承

@(文档)[马克飞象,Markdown,JavaScript]

通过原型链，对象的属性分成两种：自身的属性和继承的属性。JavaScript 语言在 `Object` 对象上面，提供了很多相关方法，来处理这两种不同的属性。


### 1. Object.getOwnPropertypeNames()
`Object.getOwnPropertyNames` 方法返回一个数组，成员是对象本身的所有属性的键名，不包含继承的属性键名。

``` javascript
Object.getOwnPropertyNames(location);
// ["replace", "assign", "href", "ancestorOrigins", "origin", "protocol", "host", "hostname", "port", "pathname", "search", "hash", "reload", "toString", "valueOf"]
```
对象本身的属性之中，有的是可以枚举的 `enumerable[ɪ'njʊmərəbl]` ，有的是不可以枚举的， `Object.getOwnPropertyNames` 方法返回所有键名。

如果只获取那些可以枚举的属性，使用 `Object.keys` 方法。

``` javascript
Object.keys(location);
// ["replace", "assign", "href", "ancestorOrigins", "origin", "protocol", "host", "hostname", "port", "pathname", "search", "hash", "reload"]
```
可以看到相对于使用 `Object.getOwnPropertyNames` 所得到的 `location` 对象的属性少了两个（`toString`,`valueOf`）。


### 3. Object.prototype.hasOwnProperty()
对象实例的 `hasOwnProperty` 方法返回一个布尔值，用于判断某个属性定义在对象自身，还是定义在原型链上。

``` javascript
location.hasOwnProperty('length');
// false

location.hasOwnProperty('valueOf');
// true
```

`hasOwnProperty` 方法是JavaScript之中唯一一个处理对象属性时，不会遍历原型链的方法。


### 3. in 运算符和 for...in 循环

`in` 运算符返回一个布尔值，表示一个对象是否具有某个属性。它不区分该属性是对象自身的属性，还是继承的属性。

``` javascript
'lenght' in location; // false
'toString' in location; //true
```

`in` 运算符常用于检查一个属性是否存在。