// promise 有个excutor执行器 立即执行
// status定义promise的状态
// value 表示成功的值 
// reason 失败的值 
// 解析promise的函数
function resolvePromise(promise2,x,resolve,reject){
  // 判断x是不是promise 
    // 规范里规定了一段代码，这个代码可以实现我的promise和别人的promise 可以进行交互 
    // 不能自己等待自己完成
    if(promise2===x){
        return reject(new TypeError('循环引用'))
    }
    // x不是null 或者对象或者函数 处理所以promise的实现
    let called; //用来防止多次调用
    if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
        try { // 是否是thenable对象（具有then方法的对象/函数）
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if(called) return;
                    called = true;
                    // 如果y是promise 递归解析
                    resolvePromise(promise2, y, resolve, reject);
                }, e => {
                    if(called) return;
                    called = true;
                    reject(e);
                })
            } else { // 说明是一个普通对象/函数
                resolve(x);
            }
        } catch(e) {
            if(called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}
class Promise {
    constructor(excutor){
        this.status = "pending";
        this.value = undefined;
        this.reason = undefined;
        this.onResolveCb= [];
        this.onRejectCb = [];//存放失败和成功的回调
        let  resolve=(value)=>{//成功的时候的状态转换函数
           if(this.status==='pending'){
               this.status='resovled';
               this.value= value;
               this.onResolveCb.forEach(fn=>fn())
           } 
        }
        let reject=(reason)=>{//失败的时候的状态转换函数
            if(this.status==='pending'){
                this.status = 'rejected';
                this.reason = reason;
            }
            this.onRejectCb.forEach(fn=>fn())
        }
        try{
         excutor(resolve,reject)  
        }catch(e){
           reject(e) 
        }
    }
    then(onFulfilled, onRejected){
        onFulfilled = typeof onFulfilled==='function'?onFulfilled:val=>val;
        onRejected = typeof onRejected==='function'?onRejected:err=>{
            throw err
        };
        let self = this;
        let promise2;
        promise2 = new Promise((resolve,reject)=>{
            if(this.status==='resovled'){
             setTimeout(()=>{
               try{
                let x =  onFulfilled(this.value)
                resolvePromise(promise2,x,resolve,reject)  
               }catch(e){
                    reject(e)
               }

               
             })
              
               
            }
            if(this.status==='rejected'){
             setTimeout(()=>{
                 try{
                    let x = onRejected(this.reason)
                   resolvePromise(promise2,x,resolve,reject)
                 }catch(e){
                     reject(e)
                 }
                },0)
            }
            if(this.status==='pending'){
                this.onResolveCb.push(()=>{
                    setTimeout(()=>{
                        try{
                            let x =  onFulfilled(this.value)
                            resolvePromise(promise2,x,resolve,reject)
                        }catch(e){
                            reject(e)
                        }
                        
                    },0)
                   
                })
                this.onRejectCb.push(()=>{
                    setTimeout(()=>{
                        try{
                         let x = onRejected(this.reason)
                           resolvePromise(promise2,x,resolve,reject)
                        }catch(e){
                            reject(e)
                        }
                        
                    },0)
                   
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

module.exports = Promise;