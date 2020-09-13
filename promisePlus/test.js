// x.then 报错的测试用例
let x = {};
Object.defineProperty(x,'then',{
    get(){
        throw new Error('err')
    }
})
console.log(x.then)