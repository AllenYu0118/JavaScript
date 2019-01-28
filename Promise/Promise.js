/**
* @description: Promise 实现
* @author:      yulei@addcn.com
* @dateTime:    2019-01-28 14:46:45
*/

class Promise {
    // executor 即構造時傳遞的函數
    constructor(executor) {
        let _this = this
        _this.status = 'pending' // 定义的初始状态
        _this.value = undefined // 用来保存正确执行的值
        _this.reason = undefined // 用来保存错误执行的值

        _this.onResolvedCallbacks = [] // 异步解决方案关键点 1, 保存待执行的 resolve 函数
        _this.onRejectedCallbacks = [] // 异步解决方案关键点 1, 保存待执行的 reject 函数

        // 定义执行成功的函数
        let resolve = (value) => {
            // 防止重复执行
            if (_this.status === 'pending') {
                _this.status = 'resolved'
                _this.value = value

                // 遍历执行数组中的 resolve 函数
                _this.onResolvedCallbacks.forEach(fn => {
                    fn()
                })
            }
        }

        // 定义执行错误的函数
        let reject = (reason) => {
            // 防止重复执行
            if (_this.status === 'pending') {
                _this.status = 'rejected'
                _this.reason = reason

                // 遍历执行数组中的 reject 函数
                _this.onRejectedCallbacks.forEach(fn => {
                    fn()
                })
            }
        }
        try {
            // 執行傳遞的函數
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }

    then (onFulfilled, onRjected) {
        // 如果 onFulfilled 为空处理
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (value) { return value }

        // 如果 onRjected 为空处理
        onRjected = typeof onRjected === 'function' ? onRjected : function (err) { throw err }

        let _this = this
        let promise2
        if (_this.status === 'resolved') {
            // 再次返回一个 Promise 对象
            promise2 = new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        // 
                        let x = onFulfilled(_this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            })
        }

        if (_this.status === 'rejected') {
            promise2 = new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        let x = onRjected(_this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            })
            
        }

        if (_this.status === 'pending') {
            promise2 = new Promise((resolve, reject) => {
                _this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(_this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })

                _this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRjected(_this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            })
        }
        return promise2
    }

    // 执行错误的方法
    catch (callback) {
        return this.then(null, callback)
    }

    // 队列执行多个 Promise, 全部执行完毕才会触发 resolve
    // 有一个 Promise 执行了 reject, 就会导致 all 函数执行 reject
    all (promises) {
        return new Promise((resolve, reject) => {
            let arr = []
            let i = 0

            for (let i=0; i < promises.length; i++) {
                promises[i].then(y => {
                    processData(i, y)
                }, reject)
            }

            function processData (index, y) {
                // 保存对应 Promise 的值
                arr[index] = y

                // 如果执行完了, 触发 resolve
                if (++i === promises.length) {
                    resolve(arr)
                }
            }
        })
    }

    // 执行多个 Promise 对象
    // 其中任何一个执行完毕的状态即 race 的状态
    race (promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i <= promises.length; i++) {
                promises[i].then(resolve, reject)
            }
        })
    }

    // 定义 resolve 方法
    resolve (value) {
        return new Promise((resolve, reject) => {
            resolve(value)
        })
    }

    resolve(err) {
        return new Promise((resolve, reject) => {
            reject(err)
        })
    }

}

// 统一处理 then 函数中不同的情况
function resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('循环引用了'))
    }

    let called

    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then

            if (typeof then === 'function') {
                then.call(x, (y) => {
                    if (called) return 
                    called = true

                    resolvePromise(promise2, y, resolve, reject)
                }, err => {
                    if (called) return
                    called = true
                    reject(err)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}

// 给 promises-aplus-tests 库提供的接口
Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

module.exports = Promise