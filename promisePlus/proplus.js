// promise解析函数 用来解析 promise2 和 x 的关系
function resolvePromise(promise2,x,resolve,reject){
    // 如果x和promise2相同 抛出一个类型错误 
    // 属于循环引用错误 Chaining cycle detected for promise #<Promise> at <anonymous>
    if(promise2===x){
        throw TypeError('循环引用！Chaining cycle detected for promise #<Promise> at <anonymous>')
    }
    let called; // 防止多次调用
    // 判断 x 是不是一个对象或者函数
    if(x!=null&&((typeof x === 'object')||(typeof x === 'function'))){
        try{
            then = x.then// 可能出现异常
            // 如果then是一个函数 即then是一个promise 把 x 作为 then 的 this
            if(typeof then === 'function'){
                then.call(x,(y)=>{
                    if(called) return
                    called = true;
                    // 如果resolve里再传一个promise 即 y 是promise 则需要再解析
                    resolvePromise(promise2,y,resolve,reject)
                    // resolve(y)
                },(r)=>{
                    if(called) return
                    called = true;
                    reject(r)
                })
            }else{// 如果不是函数 则是普通对象 {then:{}} 直接成功
                resolve(x)
            }
        }catch(e){
            if(called) return
            called = true;
            reject(e) // 出现异常 返回失败的promise
        }
    }else{
        // 如果 x 不是一个对象或者函数 则 x 是一个普通的值 直接返回成功的函数
        resolve(x)
    }
}

/**
 * @param {function} excutor 
 * @param {function} resolve
 * @param {function} reject
 * @param {string} status promise的状态 pending 等待； resolved 成功； rejected 失败；
 * @param {string} value 成功的原因
 * @param {string} reason 失败的原因
 * @param {function} then 原型上的方法
 */
// 有异步的情况下 因为excutor是立即执行的 所以status始终是pending状态
class Promise {
    constructor(excutor){
        this.status = "pending";
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallback = [] // 专门存放成功的回调
        this.onRejectedCallback = [] // 专门存放失败回调
        // 只有等待状态才能变成成功或失败
        let resolve=(value)=>{
            if(this.status==="pending"){
                this.status = "resolved"
                this.value = value
                this.onFulfilledCallback.forEach(item=>item())
            }
        }
        let reject=(reason)=>{
            if(this.status==="pending"){
                this.status = "rejected"
                this.reason = reason
            }
            this.onRejectedCallback.forEach(item=>item())
        }
        try { // excutor执行可能会报错 报错直接拒绝掉 但是无法捕获异步的错误
            excutor(resolve,reject)
        } catch (e) {
            reject(e)
        }
    }
    // onFulfilled 成功的回调 onRejected 失败的回调 可选参数
    // onFulfilled onRejected 只允许异步调用 因为规定then是异步的
    // onFulfilled onRejected 必须是一个函数 如果不是 必须变成一个函数 
    then(onFulfilled,onRejected){
        onFulfilled=typeof onFulfilled==='function'?onFulfilled:val=>val;
        onRejected=typeof onRejected==='function'?onRejected:err=>{throw err};
        let promise2; // then 返回一个新的 promise
        promise2 = new Promise((resolve,reject)=>{
            if(this.status==="resolved"){
                setTimeout(()=>{
                    try {
                        let x = onFulfilled(this.value)  // 无论成功还是失败 都返回 x 
                        // console.log(promise2,'1')
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (e) {
                        reject(e)
                    }
                },0)
            }
            if(this.status==="rejected"){
                setTimeout(()=>{
                    try {
                        let x = onRejected(this.reason)
                        // console.log(promise2,'2')
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (e) {
                        reject(e)
                    }
                },0)
            }
            if(this.status==="pending"){
                // 成功存放成功的回调
                this.onFulfilledCallback.push(()=>{
                    setTimeout(()=>{
                        try {
                            let x = onFulfilled(this.value)
                            // console.log(promise2,'3')
                            resolvePromise(promise2,x,resolve,reject)
                        } catch (e) {
                            reject(e)
                        }
                    },0)
                })
                // 失败存放失败的回调
                this.onRejectedCallback.push(()=>{
                    setTimeout(()=>{
                        try {
                            let x = onRejected(this.reason)
                            // console.log(promise2,'4')
                            resolvePromise(promise2,x,resolve,reject)
                        } catch (e) {
                            reject(e)
                        }
                    },0)
                })
            }
        })
        return promise2;
    }
}

// 测试是否符合A+规范
// 全局下载
// npm i -g promises-aplus-tests
// 测试
// promises-aplus-tests 文件名
Promise.defer = Promise.deferred = function(){
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd; 
}

// Promise.race() 类上的方法 必须通过类对象调用 
// then 是属于原型上的方法 每个实例对象都可以调用
// cmd
module.exports = Promise;