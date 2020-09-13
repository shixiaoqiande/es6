let Promise  = require('./promise2');
let p = new Promise((resolve,reject)=>{
    resolve()
})

p.then(data=>{
   return new Promise((resolve,reject)=>{
     resolve(new Promise((resolve,reject)=>{
        resolve(100)
     }))
   })
},err=>{
 
}).then(data=>{
  console.log(data)
})