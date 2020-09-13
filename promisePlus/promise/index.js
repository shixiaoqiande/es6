let Promise  =require('./promise2')
let p = new Promise((resolve,reject)=>{
     
     
})
p.then().then(data=>{
    console.log(data,'测试')
},err=>{
    console.log(err)
})

