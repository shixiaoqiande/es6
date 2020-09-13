// 测试返回的y是promise  验证then.call 里面的resolvePromise递归是否正确  
let  Promise  = require('./p1')
let p = new Promise((resolve,reject)=>{
   resolve()
})
p.then(data=>{
    return new Promise((resolve,reject)=>{
       resolve(new Promise((resolve,reject)=>{
            resolve(100)
       }))
    })
}).then(data=>{
    console.log(data)
})