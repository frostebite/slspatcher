
var FTPClient = require('ftp');
var client;
var config = {
  host:"arma.uk-sf.com",
  user:"SLSREAD",
  password:"password"
};

var jobs = new Array();

function ListJob(callback, path){
    this.jobs.push({type:"list",callback:callback, path:path});
    JobsIgnition();
}

function GetJob(callback, path){
    this.jobs.push({type:"get",callback:callback, path:path});
    JobsIgnition();
}

function JobsIgnition(){
    if(this.client == null){
        this.client = new FTPClient();
        this.client.on('ready', function() {JobCycle();});
        this.client.connect(config);
    }
}

function JobCycle(){
    while(jobs.length>0){
        job = jobs.pop();
        this.client.cwd(job.path, function(){
            if(job.type == "list"){
                this.client.list(function(err, list) {job.callback(job, list)});
            }
            else if(job.type == "get"){
                this.client.get(item.name, function(err, stream) {job.callback(job, stream)});
            }
        });
    }
}