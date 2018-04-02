
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
    console.log("attempting to cycle jobs");
    lock.acquire('FTPJobs', (cb)=>{
        console.log("got lock");
        console.log(jobs);
        while(jobs.length>0){
                job = jobs.pop();
                console.log(job);
                job.Process(this.client);
        }
        this.client = null;
        cb();
    }, (err, ret)=>{
        if(this.client)
            JobCycle();
    });
}

class FTPJob{
    constructor(type, callback, path, item = ""){
        this.type = type;
        this.callback = callback;
        this.path = path;
        this.item = item;
    }
    Process(client) {
        client.cwd("/"+this.path, (err, currentDir)=>{
            console.log("starting to process an FTP Job:");
            console.log(currentDir);
            console.log(this);
            console.log(" ");
            if(this.type == "list") this.ProcessList(client);
            else if(this.type == "get") this.ProcessGet(client);
        });
    }

    ProcessGet(client){
        client.get(this.item, (err, stream) => {
            if(err){
                console.log("error in get job:");
                console.log(err);
                console.log(this);
                return;
            }
            this.callback(this, stream);
        });
    }

    ProcessList(client){
        client.list((err, list) => {
            if(err){
                console.log("error in list job:");
                console.log(err);
                console.log(this);
                return;
            }
            this.callback(this, list);
        });
    }
}