// 穿透 测试用例 
 let Promise = require('./p1')
let p = new Promise((resolve,reject)=>{
    // reject(100)
     resolve(299)
})
p.then().then(data=>{
    console.log(data,'sucess')
},err=>{
    console.log(err,'error')
})
// 成功的时时候第一个不传 相当于传了一个函数  function(data){ return data }  data=>data  
// 失败的时候第一个参数不传相当于传了一个null ,失败相当于传了 err =>{throw err}
// 失败的测试用例
// p.then(null,(err)=>{
//     throw  err
// }
// ).then(data=>{
//     console.log(data)
// },err=>{
//     console.log(err,'error')
// })
// 成功的测试用例
// p.then(data=>data
// ).then(data=>{
//     console.log(data)
// },err=>{
//     console.log(err,'error')
// })