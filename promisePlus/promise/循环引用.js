let Promise  =require('./promise2')
let p = new Promise((resolve,reject)=>{
     resolve(1)
})
var promise2 = p.then(data=>{
    return promise2
})
promise2.then(data=>{},
    err=>{
        console.log(err)
    })
