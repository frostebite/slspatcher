
var FTPClient = require('ftp');
var client;
var config = {
  host:"arma.uk-sf.com",
  user:"SLSREAD",
  password:"password"
};

var jobs = new Array();

function ListJob(callback, path){
    lock.acquire('FTPJobs', (cb)=>{
        this.jobs.push(new FTPJob("list", callback, path));
        JobsIgnition();
        cb();
    }, LockError);
}

function GetJob(callback, path, item, InstallationFolder, filesystem){
    lock.acquire('FTPJobs', (cb)=>{
        this.jobs.push(new FTPJob("get",callback,path, item, InstallationFolder, filesystem));
        JobsIgnition();
        cb();
    }, LockError);
}

function JobsIgnition(){
    if(this.client == null){
        this.client = new FTPClient();
        this.client.on('ready', () => {JobCycle();});
        this.client.connect(config);
    }
}

function JobCycle(){
    if(jobs.length!=0){
        job = jobs.pop();
        job.Process(this.client);
        JobCycle();
    }
    else{
        this.client = null;
    }
}

class FTPJob{
    constructor(type, callback, path, item = "", InstallationFolder="", filesystem = null){
        this.type = type;
        this.callback = callback;
        this.path = path;
        this.item = item;
        this.InstallationFolder = InstallationFolder;
        this.filesystem = filesystem;
    }
    Process(client) {
        client.cwd(this.path, (err, currentDir)=>{
            if(!err){
                console.log(this);
                console.log(currentDir);
                if(this.type == "list"){
                    client.list((err, list) => {
                        if(err!=null){
                            console.log(err);
                            return;
                        }
                        console.log(list);
                        this.callback(this, list)
                    });
                }
                else if(this.type == "get"){
                    client.get(this.item, (err, stream) => {
                        if(err){
                            console.log(err);
                            return;
                        }
                        stream.once('close', () => { this.callback(this); });
                        stream.pipe(this.filesystem.createWriteStream(this.InstallationFolder+'/'+this.path+'/'+this.item));
                        
                    });
                }
                else{
                    console.error("no handler for job type "+this.type);
                }
            }
            else{
                this.callback(this, null);
            }
        });
    }
}