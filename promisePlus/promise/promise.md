写promise 需要遵循A+ 规范 
1. 解决异步的问题  
  方案：pending状态的时候存放2个数组 一个放成功的回调 一个放失败的回调 发布订阅   
2. 解决链式调用问题  then里面返回promise2  
   2.23 then must return a promise 
   promise2 = promise1.then(onFulfilled, onRejected); 
   2.23 then里面必须返回一个promise 名字叫做promise2  

   2.2.71  If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x)
   成功和失败的回调 返回一个值叫做x,用一个函数来解析promise2和x的关系   

3. 链式调用封装通用方法 解析promise2 用x表示结果  resolvePromise处理函数  
 判断：如果promise2 和相同抛出类型错误 
 let p = new Promise((reslove,reject)=>{
     reslove()
 })

var  promise2 = p.then(data=>{
    return promise2
})

 2.3.1  If promise and x refer to the same object, reject promise with a TypeError as the reason. 
 如果x和promise2相同 排除一个类型错误 

2.3. 3 
  Otherwise, if x is an object or function,
  判断x是对象或者函数 

2.3. 4 If x is not an object or function, fulfill promise with x.
如果x不是对象或者函数 表示x是一个普通值 直接返回成功 resolve(x)
 
2.3.1  Let then be x.then
    让then = x.then 

2.3.2 If retrieving the property x.then  results in a thrown exception e, reject  promise with e as the reason  
 如果出现异常 返回是失败promise  
 reject(e)

 如果then是函数 如果y是promise需要递归解析
    then.call(x,y=>{ //如果y是promise就继续递归解析promise
                resolvePromise(promise2,y,resolve,reject)

            },err=>{
                reject(err)
            })
2.34 如果不是对象或者函数表示x是普通值
if x not an object or function, fulfill promise with x.


4. 为什么resolve 加setTimeout?

// 2.2.4规范  
onFulfilled  onRejected 只允许异步调用
因为规定then 是异步的 

try catch 无法捕获异步的错误   




A+规范  2.26 
 onFulfilled and onRejected  不能被同时调用（多次调用）


onFulfilled, onRejected   是可选参数 

2.25 onFulfilled and onRejected must be called as functions (i.e. with no this value). 
onFulfilled onRejected 必须是函数 如果不是必须变成一个函数
 
promise.catch 
catch 就是不传成功的函数 

测试a+规范的包   
npm i -g promises-aplus-tests  
promise测试 
promises-aplus-tests  你写的promise js文件 