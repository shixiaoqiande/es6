let Promise = require('./proplus');
let p = new Promise((resolve,reject)=>{
    // setTimeout(()=>{
        // resolve(new Promise((resolve,reject)=>{
            resolve('1')
        // }));
    // },1000)
})
p.then(data=>{
    // console.log(data)
    return new Promise((resolve,reject)=>{
        resolve(new Promise((resolve,reject)=>{
            resolve('2')
        }))
    })
}).then(data=>{
    console.log(data)
})
// 类型相同 抛出错误 Chaining cycle detected for promise #<Promise> at <anonymous>
// var promise2 = p.then(data=>{
//     return promise2
// })
// promise2.then(data=>{},err=>{
//     console.log(err)
// })