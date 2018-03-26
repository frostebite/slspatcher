class SizeCalculator{
    constructor(RootDirectory = ""){
        this.RootDirectory = RootDirectory;
        this.TotalSize = 0;
        this.DirectoriesScanned = new Array();
        this.DirectoriesFound = new Array();
        this.DirectoriesFound.push(this.RootDirectory);
        this.mainCallback = ()=>{console.log("no callback for size calculator "+this.RootDirectory);};
    }

    RecursiveSizeCalculate(path){
        ListJob((job, list)=>{
            console.log("scanning job..." + job.path);
            if(list != null){
                list.forEach((item) => { 
                    this.HandleListItem(job.path, item);
                });
            }

            lock.acquire('Scanned', (callback)=>{
                this.DirectoriesScanned.push(job.path);
                console.log(this);
                if(this.DirectoriesScanned.length == this.DirectoriesFound.length){ 
                    this.mainCallback(this.TotalSize);
                }
                callback();
            }, LockError);
        }, path);
    }
        
    HandleListItem(path, item){
        if(item.type == "d"){
            lock.acquire('ToScan', (callback)=>{ this.DirectoriesFound.push(path+"/"+item.name);callback();}, LockError);
            this.RecursiveSizeCalculate(path+"/"+item.name);
        }
        else{lock.acquire('SizeScanned', (callback)=>{ this.TotalSize+=item.size; callback();}, LockError)}
    }
}

function LockError(err, ret){
    if(err!=null) console.log(err.message);
}
