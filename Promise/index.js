let Promise = require('./Promise')

// hello world
// let p1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('hello')
//     }, 3000)
// }).then(res => {
//     console.log(`${res} world`)
// })

// example 2
// let p2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('Hello')
//     }, 3000)
// }).then(res => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(`${res} JavaScript`)
//         }, 2000)
//     })
// }).then(res => {
//     console.log(`${res} World!`)
// })

// example 3
let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Hello')
    }, 2000)
}).then(res => {
    return `${res} JavaScript`
}).then(res => {
    console.log(`${res} World!`)
})


// 測試 Promise 類的功能是否完善符合 Promise A+ 規範
// var promisesAplusTests = require("promises-aplus-tests");
// promisesAplusTests(Promise, function (err) {
//     // All done; output is in the console. Or check `err` for number of failures.
// });