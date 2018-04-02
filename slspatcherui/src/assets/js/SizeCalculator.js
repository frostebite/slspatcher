class SizeCalculator{
    constructor(RootDirectory, InstallationFolder, filesystem, shell){
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
        this.UpdatedSize = 0;

        this.NoRemote = false;

        this.filesystem = filesystem;

        this.sync = false;
        
        this.shell = shell;
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
            this.HandleCompletion();
        }, path);
    }

    HandleCompletion(){
        console.log("is complete?");
        console.log(this);
        if(this.DirectoriesScanned.length == this.DirectoriesFound.length){ 
            if(this.UpdateSize>0)
                this.RequiresUpdate = true;
            if(this.TotalSize==0)
                this.NoRemote = true;
                window.dispatchEvent(new CustomEvent('project-status', {detail:{state:"ready", project:this.RootDirectory, Size:this.BytesToSize(this.TotalSize)}}));
            this.mainCallback(this);
        }
    }

    HandleFolder(job, list){
        if(list != null){
            list.forEach((item)=>{
                this.HandleFolderItem(job, item);
            });
            if(this.sync){
                this.TrimDeletedFiles(list, job.path);
            }
        }
    }

    HandleFolderItem(job, item){
        if(item.type == "d"){
            console.log("found subdirectory:");
            console.log(job);
            console.log(item);
            this.DirectoriesFound.push(job.path+"/"+item.name);
            this.RecursiveSizeCalculate(job.path+"/"+item.name);
        }
        else{
            this.filesystem.stat(this.InstallationFolder+'/'+job.path+'/'+item.name, (err, stats) => {
                if(stats == null){
                    this.TotalSize+=item.size;
                    this.UpdateSize+=item.size;
                    if(this.sync){
                        this.SyncFile(job, item);
                    }
                }
                else if(stats["size"] == item.size){
                    this.TotalSize+=item.size;
                }
                else if(stats["size"] != item.size){
                    this.TotalSize+=item.size;
                    this.UpdateSize+=item.size;
                    if(this.sync){
                        this.SyncFile(job, item);
                    }
                }
                else{
                    console.error("bad file state in HandleFolder");
                    console.error(this);
                }
            });
        }
    }

    SyncFile(job, item){
        this.shell.mkdir('-p', this.InstallationFolder+"/"+job.path+"/");
        GetJob((getJob, stream)=>{
            this.UpdatedSize+=item.size;
            stream.once('close', () => { console.log("download complete"); });
            stream.pipe(this.filesystem.createWriteStream(this.InstallationFolder+'/'+getJob.path+'/'+getJob.item));
            window.dispatchEvent(new CustomEvent('project-status', {detail:{state:"downloading", project:this.RootDirectory, DownloadSize:this.BytesToSize(this.UpdatedSize), UpdatedSize:this.BytesToSize(this.UpdateSize), Size:this.BytesToSize(this.TotalSize)}}));
        }, job.path, item.name);
    }

    TrimDeletedFiles(remoteList, path){
        this.filesystem.readdir(this.InstallationFolder+'/'+path, (err, localList)=>{
        if(localList == null) return;
        for (var i=0; i<localList.length; i++) {
            var remoteMatch = false;
            for (var w=0; w<remoteList.length; w++) {
                if(localList[i]==remoteList[w].name){
                    remoteMatch = true;
                }
            }
            if(!remoteMatch){
                this.filesystem.unlink(this.InstallationFolder+'/'+path+"/"+localList[i], (err)=>{
                    if(err) console.error(err);
                });
            }
        }
        });
    }

    
    BytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };
}

function LockError(err, ret){
    if(err!=null) console.log(err.message);
}
