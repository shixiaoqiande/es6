// 验证返回的y是promise then.call里的解析递归是否正确
let Promise = require('./proplus');
let p = new Promise((resolve,reject)=>{
    resolve('1')
})
p.then(data=>{
    return new Promise((resolve,reject)=>{
        resolve(new Promise((resolve,reject)=>{
            resolve('2')
        }))
    })
}).then(data=>{
    console.log(data)
})