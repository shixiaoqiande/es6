// x.then 报错的测试用例  
let x = {};
Object.defineProperty(x,'then',{
   get(){
     throw new Error('1234')
   } 
})
console.log(x.then)