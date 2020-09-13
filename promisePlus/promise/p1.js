// promise解析函数
// Chaining cycle detected for promise 循环应用
function resolvePromise(promise2,x,resolve,reject){
   // 规范里规定了一段代码，这个代码可以实现我的promise和别人的promise 可以进行交互 
   // 如果完全相等 属于循环引用错误 
  if(promise2 === x){
      throw TypeError('循环引用')
   }
   let called;//防止多次调用
   if(x!=null&&((typeof x ==='object')||(typeof x ==='function'))){
      try{
         then = x.then; 
         if(typeof then ==='function'){
           then.call(x,
           (y)=>{
             if(called) return 
             called = true;
            // 如果y是promise 需要继续解析 递归调用resolvePromise
             resolvePromise(promise2,y,resolve,reject)
           },
           (r)=>{
               if(called) return 
                called = true;
               reject(r)
           })
         }else{ //普通对象 {then:{}}
            resolve(x)
         }
         
      }catch(e){
         if(called) return 
         called = true;
         reject(e)
      }
   }else{//x是普通值 直接成功
      resolve(x)
   }
}

/**
 *  @param  {function} excutor  
 *  @param  {function} resolve 成功的函数
 *  @param  {function} reject  失败的函数
 *  @param  {string} status  promise的状态  pending 等待 resloved 成功 rejected 失败
 *  @param  {string} value成功的原因
 *  @param  {string}  reason失败的原因
 *  @param  {function}  then 原型上的方法
*/
// 有异步的情况下 因为excutor 是立即执行的 所以status 始终是pengding状态  
// 例如：
//  setTimeout(()=>{
//         resolve(1)
//       },1000)
// 1秒之后才会调用resolve 或者reject 改变状态
class Promise {
   constructor(excutor){
     this.status = 'pending';
     this.value  = undefined;
     this.reason = undefined;
     this.onFuflilledCallback = [] // 专门存放成功的回调  
     this.onRejectedCallback= [] // 专门存放失败的回调
     //promise的特点 只有等待状态才能够变成成功或者失败  
      let  resolve= (value) =>{
       if(this.status==='pending'){
         this.status ='resolved';
         this.value= value;
         this.onFuflilledCallback.forEach(fn=>fn())
        }
     }
      let reject=(reason)=>{
        if(this.status==='pending'){
            this.status='rejected';
            this.reason = reason;
            this.onRejectedCallback.forEach(fn=>fn())
        }
     }
     try{ //excutor 执行可能会报错 报错直接promise拒绝  
        excutor(resolve,reject)
      }catch(e){
        reject(e)
     }
    
   }
    // onFuflilled 成功的回调 OnRejected 失败的回调  可选参数 
   then(onFuflilled,onRejected){
      // 判断onFuflilled 和 
      onFuflilled=typeof onFuflilled==='function'?onFuflilled:val=>val;
      onRejected = typeof onRejected==='function'?onRejected:err=>{throw err}
      let promise2;
      // setimeout  onFuflilled OnRejected 只允许异步调用 因为then是异步的 
      promise2 = new Promise((resolve,reject)=>{
         if(this.status==='resolved'){
            setTimeout(()=>{
               try{
                  let x = onFuflilled(this.value)
                  resolvePromise(promise2,x,resolve,reject)
               }catch(e){
                   reject(e)
               }
           },0)
           
         }
         if(this.status==='rejected'){
            setTimeout(()=>{
               try{
                  let x =  onRejected(this.reason)
                  resolvePromise(promise2,x,resolve,reject)
                }catch(e){
                   reject(e)
                }
            })
          }
         if(this.status==='pending'){
            //成功存放成功的回调
            this.onFuflilledCallback.push(()=>{
             setTimeout(()=>{
                try{
                  let x = onFuflilled(this.value)
                  resolvePromise(promise2,x,resolve,reject)
                }catch(e){
                  reject(e)
                }
             },0)
            })
           // 失败存放失败的回调
            this.onRejectedCallback.push(()=>{
               setTimeout(()=>{
                  try{
                     let x =onRejected(this.reason)
                     resolvePromise(promise2,x,resolve,reject)
                  }catch(e){
                     reject(e)
                  }
               })
             })
          }
      })
     return promise2
   }
}

// 测试用的代码   
Promise.defer = Promise.deferred = function() { // 延迟对象
   let dfd = {};
   dfd.promise = new Promise((resolve, reject) => {
       dfd.resolve = resolve;
       dfd.reject = reject;
   });
   return dfd;
}
module.exports =  Promise;
