
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

/*function GetJob(callback, path){
    this.jobs.push({type:"get",callback:callback, path:path});
    JobsIgnition();
}*/

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
    constructor(type, callback, path){
        this.type = type;
        this.callback = callback;
        this.path = path;
    }
    Process(client) {
        client.cwd(this.path, (err, currentDir)=>{
            if(!err){
                console.log(this);
                console.log(currentDir);
                if(this.type == "list"){
                    client.list((err, list) => {
                        if(err!=null){
                            return;
                        }
                        console.log(list);
                        console.log(this.path);
                        this.callback(this, list)
                    });
                }
                else if(job.type == "get"){
                    client.get(item.name, (err, stream) => {this.callback(job, stream)});
                }
            }
            else{
                this.callback(this, null);
            }
        });
    }
}