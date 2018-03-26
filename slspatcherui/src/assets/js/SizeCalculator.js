class SizeCalculator{
    constructor(){
        this.RootDirectory = "";
        this.TotalSize = 0;
        this.DirectoriesScanned = new Array();
        this.DirectoriesFound = new Array();
        this.DirectoriesFound.push(this.RootDirectory);
    }

    RecursiveSizeCalculate(path, mainCallback){
        ListJob((job, list)=>{

            console.log("scanning job..." + job.path);
            if(list != null){
                list.forEach((item) => { 
                    this.HandleListItem(job.path, item, mainCallback);
                });
            }

            lock.acquire('Scanned', (callback)=>{
                this.DirectoriesScanned.push(job.path);
                console.log(this);
                if(this.DirectoriesScanned == this.DirectoriesFound){ 
                    this.mainCallback(this.DirectoriesScanned.length);
                }
                callback();
            }, LockError);
        }, path);
    }
        
    HandleListItem(path, item, mainCallback){
        if(item.type == "d"){
            lock.acquire('ToScan', (callback)=>{ this.DirectoriesFound.push(path+"/"+item.name);callback();}, LockError);
            this.RecursiveSizeCalculate(path+"/"+item.name, mainCallback);
        }
        else{lock.acquire('SizeScanned', (callback)=>{ this.TotalSize+=item.size; callback();}, LockError)}
    }
}

function LockError(err, ret){
    if(err!=null) console.log(err.message);
}
