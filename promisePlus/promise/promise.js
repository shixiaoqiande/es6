class Promise{
    constructor(excutor){
        this.status='pending';
        this.value= undefined;
        this.reason=undefined;
        let resolve=(value) =>{
            if(this.status==="pending"){
                this.status='resolved';
                tthis.value=value
            }
        }
        let reject=(reject)=>{
            this.status='reject';
            this.reason= 'reason'
        }
        try{
            excutor(resolve,reject)
        }catch(e){
            reject(e)
        }
       
    }
    then(onFufilled,onReject){
       if(this.status==='resolved'){
            onFufilled(this.value)
        }
        if(this.status==='reject'){
            onReject(this.reason)
        }
    }
}

module.exports = Promise