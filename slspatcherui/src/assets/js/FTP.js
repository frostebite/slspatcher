
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
        cb();
    }, (err, ret)=>{
        JobsIgnition();
    });
}

function GetJob(callback, path, item){
    lock.acquire('FTPJobs', (cb)=>{
        this.jobs.push(new FTPJob("get",callback,path, item));
        cb();
    }, (err, ret)=>{
        JobsIgnition();
    });
}

function JobsIgnition(){
    if(this.client == null){
        console.log("jobs igniting");
        console.log(jobs);
        this.client = new FTPClient();
        this.client.on('ready', () => {JobCycle();});
        this.client.connect(config);
    }
}

function JobCycle(){
        while(jobs.length>0){
            job = jobs.pop();
            job.Process(this.client);
        }
        //possible error state here
        this.client = null;
}

class FTPJob{
    constructor(type, callback, path, item = ""){
        this.type = type;
        this.callback = callback;
        this.path = path;
        this.item = item;
    }
    Process(client) {
        lock.acquire('ProcessingFTP', (cb)=>{
            client.cwd("/"+this.path, (err, currentDir)=>{
                if(err || !currentDir){
                    this.callback(this, null);
                    cb();
                    return;
                }
                console.log("starting to process an FTP Job:");
                console.log(currentDir);
                console.log(this);
                console.log(" ");
                if(this.type == "list") this.ProcessList(client, cb);
                else if(this.type == "get") this.ProcessGet(client, cb);
            });
        }, LockError);
    }

    ProcessGet(client, cb){
        client.get(this.item, (err, stream) => {
            if(err){
                console.log("error in get job:");
                console.log(err);
                console.log(this);
                return;
            }
            this.callback(this, stream);
            cb();
        });
    }

    ProcessList(client, cb){
        client.list((err, list) => {
            if(err){
                console.log("error in list job:");
                console.log(err);
                console.log(this);
                return;
            }
            this.callback(this, list);
            cb();
        });
    }
}