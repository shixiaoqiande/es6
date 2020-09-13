# promise 书写流程 

>使用es5要注意this指向

1. 创建一个类/构造函数  名字 Promise 参数 excutor
    excutor 是一个立即执行的构造器 参数 resolve reject
    resolve reject 是函数
    ```
        function Promise(excutor){
            excutor(resolve,reject)
        }
    ```
2. 定义状态 、成功失败的值 
    ```
        this.status = 'pending' 状态默认是 pending 等待态
        this.value = undefined 成功的值
        this.reason = undefined 失败的值
    ```
3. 定义 resolve 和 reject 方法 
    ```
        function resolve(value){...}
        function reject(reason){...}
    ```
4. 定义 then 方法 （原型上的方法）
    参数是 onFulfilled 和 onRejected
    then里面必须返回一个 promise
    ```
        Promise.prototype.then = function(onFulfilled,onRejected){
            let that = this;
            let promise2;
            promise2 = new Promise(resolve,reject){
                if(that.status==='resolved'){
                    onFulfilled(this.value)
                }
                if(that.status==='rejected'){
                    onRejected(this.reason)
                }
            }
            return promise2;
        }
    ```
5. 解决异步问题
    异步时 status 是 pending 状态 直到 resolve 或者 reject 调用 状态才会改变
    在构造函数里定义两个数组 一个放成功的回调 一个放失败的回调 （利用发布订阅的方法）
    调用resolve/reject的时候让数组里的函数一次执行
    ```
        this.resolveCb = []
        this.rejectCb = []
    ```
    在 then 函数的 pending 状态存放成功或者失败的回调
    ```
        if(that.status==='pending'){
            that.resolveCb.push(function(){
                onFulfilled(that.value)
            })
            that.rejectCb.push(function(){
                onRejected(this.reason)
            })
        }
    ```
    在resolve/reject调用时依次执行
    ```
        function resolve(value){
            this.resolveCb.foreach(function(item){item()})
        }
    ```
6. 根据A+规范 需要用一个x的值来接受then里面成功（onFulfilled）或者失败（onRejected）的回调参数
    并且 onFulfilled 和 onRejected 只能异步调用 因为 then 必须是异步的 并且需要一个函数来解析x的值
    该函数名为 resolvePromise  因为try catch 无法捕获异步异常 所以要写在异步里面
    ```
        setTimeout(function(){
            try{
                let x = onFulfilled(that.value) 
                resolvePromise(promise2,x,resolve,reject)
            }catch(e){
                reject(e)
            }
        },0) 
        ...
    ```
7. 书写解析promise的函数 resolvePromise(promise2,x,resolve,reject)
    7.1 判断 x 和 promise2 是否相等 （===）
        相等的话 抛出循环引用的 TypeError
    7.2 判断 x 是否是对象或函数 （去除null的情况）
        如果是对象或者函数 让 then = x.then 可能会报错
        如果不是直接返回成功
    ```
        if(((typeof x === "function") || (typeof x === "object")) && x !== null){
            try{
                then = x.then
            }catch(e){
                reject(e)
            }
        }else{
            resolve(x)
        }
    ```
    7.3 判断 then 是不是函数 
        如果是 表示 是一个 promise
        如果不是函数 表示是一个普通对象 直接成功
    ```
        if(typeof then === "function"){

        }else{
            resolve(x)
        }
    ```
    7.4 执行 then x 作为 （call)this 成功的回调参数 y 和失败的回调参数 r
        如果 y 是promise 用递归解析
    ```
        then.call(x,y=>{
            resolvePromise(promise2,y,resolve,reject)
        },r=>{
            reject(r)
        })
    ```
    7.5 为了防止多次调用 定义一个 called 的状态 
    ```
        let called;
        ...
        if(called) return;
        called = true;
    ```
8. 处理穿透问题 onFulfilled onRejected 不传参的问题
    ```
        onFulfilled = typeof onFulfilled === "function"?onFulfilled:val=>val;
        onRejected = typeof onRejected === "function"?onRejected:err=>{throw err};
    ```