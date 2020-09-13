// promise 有个excutor执行器 立即执行
// status定义promise的状态
// value 表示成功的值 
// reason 失败的值 
function resolvePromise(promise2,x,resolve,reject){
    // 判断x是不是promise 
    // 规范里规定了一段代码，这个代码可以实现我的promise和别人的promise 可以进行交互 
    // 不能自己等待自己完成
    if(promise2===x){
        return reject(new TypeError('循环引用'))
    }
    // x不是null 或者对象或者函数
    if(x!=null&&typeof x ==='object'||typeof x ==='function'){
     try{
         let then =x.then //取x的then方法
         if(typeof then ==='function'){
            then.call(x,y=>{ //如果y是promise就继续递归解析promise
                resolve(promise2,y,resolve,reject)

            },err=>{
                reject(err)
            })
         }else{ //x是普通值
             resolve(x)
         }
        }catch(e){
            reject(e)
      }
    
      
    }else{
        // x就是一个普通值
        resolve(x)
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
                this.status = 'reject';
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
    then(onFufilled,onReject){
     

       if(self.status==='resovled'){
           onFufilled(self.value) 
         }
       if(self.status==='reject'){
          onReject(self.reason)
        }
        // 当前没有完成也没有失败 
        if(self.status==='pending'){
            // 存放成功的回调
            self.onResolveCb.push(()=>{
                onFufilled(self.value)
            })
            // 存放失败的回调
            self.onRejectCb.push(()=>{
                onReject(self.reason)
            })
        }
    

    }
}

module.exports = Promise;