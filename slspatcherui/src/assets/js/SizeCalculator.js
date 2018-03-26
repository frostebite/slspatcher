class SizeCalculator{
    constructor(RootDirectory, InstallationFolder, filesystem){
        this.RootDirectory = RootDirectory;
        this.InstallationFolder = InstallationFolder;

        this.DirectoriesScanned = new Array();
        this.DirectoriesFound = new Array();
        this.DirectoriesFound.push(this.RootDirectory);

        this.mainCallback = ()=>{console.log("no callback for size calculator "+this.RootDirectory);};

        this.RequiresInstall = false;
        this.RemoteSize = 0;
        this.LocalSize = 0;
        this.TotalSize = 0;

        this.RequiresUpdate = false;
        this.UpdateSize = 0;

        this.NoRemote = false;

        this.filesystem = filesystem;
    }

    Start(){
        //check local status
        this.filesystem.stat(this.InstallationFolder+'/'+this.RootDirectory, (err, stats) => {
            this.RequiresInstall = (stats == null);
            this.RecursiveSizeCalculate(this.RootDirectory);
        });
    }

    RecursiveSizeCalculate(path){
        ListJob((job, list)=>{
            this.HandleFolder(job, list);
            this.DirectoriesScanned.push(job.path);
            if(this.DirectoriesScanned.length == this.DirectoriesFound.length){ 
                console.log(this);
                if(this.UpdateSize>0)
                    this.RequiresUpdate = true;
                if(this.TotalSize==0)
                    this.NoRemote = true;
                this.mainCallback(this);
            }
        }, path);
    }

    HandleFolder(job, list){
        if(list != null){
            list.forEach((item) => { 
                if(item.type == "d"){
                    this.HandleDirectoryItem(job.path, item.name);
                }
                else{
                    this.filesystem.stat(this.InstallationFolder+'/'+job.path+'/'+item.name, (err, stats) => {
                        if(stats == null){
                            this.TotalSize+=item.size;
                            this.UpdateSize+=item.size;
                        }
                        else if(stats["size"] == item.size){
                            //if() present and size/date matches, is up-to-date
                            //do nothing
                            this.TotalSize+=item.size;
                        }
                        else if(stats["size"] != item.size){
                            //if() present and not up-to-date
                            this.TotalSize+=item.size;
                            this.UpdateSize+=item.size;
                        }
                        else{
                            console.error("bad file state in HandleFolder");
                            console.error(this);
                        }
                        //old: this.HandleListItem(job.path, item);
                    });
                }
            });
        }
    }

    HandleMissingFile(){
    }

    HandleOldFile(){

    }

    HandleMatchingFile(){
        this.TotalSize+=item.size;
    }

    HandleDirectoryItem(path, directoryName){
        lock.acquire('ToScan', (callback)=>{ this.DirectoriesFound.push(path+"/"+directoryName);callback();}, LockError);
        this.RecursiveSizeCalculate(path+"/"+directoryName);
    }
}

function LockError(err, ret){
    if(err!=null) console.log(err.message);
}
