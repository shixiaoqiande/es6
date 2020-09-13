// 穿透 测试用例 
let Promise = require('./promise/p1');
let p = new Promise((resolve,reject)=>{
    // 成功 
        resolve(10)
    // 失败
        // reject(10)
})
// 成功的时候第一个参数不传 相当于传了一个函数 function(data){return data}
// 失败时 第一个参数不传 相当于传了null

// 成功的测试用例
p.then((data)=>data).then(data=>{
    console.log(data)
})

// 失败的测试用例
// p.then(null,(err)=>{
//     throw err;
// }).then(data=>{
//     console.log(data)
// },err=>{
//     console.log(err,'error')
// })